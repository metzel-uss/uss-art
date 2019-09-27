const router = require('express').Router();
const db = require('../util/db');
const util = require('../util/util');
const inputCleaningFunctions = require('../util/inputCleaningFunctions');

const tableName = 'requestForm';
const specialFieldTypeNamesAndValueFormats = {
  checkbox: 'array',
  multiselect: 'array'
};


/**
 * @swagger
 *
 * definitions:
 *   NewRequestForm:
 *     type: object
 *     required:
 *       - formTypeId
 *     properties:
 *       formTypeId:
 *         type: integer
 *       formStatusName:
 *         type: string
 *       formStatusId:
 *         type: integer
 *       rowId:
 *         type: integer
 *   RequestForm:
 *     allOf:
 *       - $ref: '#/definitions/NewRequestForm'
 *       - type: object
 *       - properties:
 *           id:
 *             type: integer
 *           formStatusName:
 *             type: string
 *   GetRequestForm:
 *     allOf:
 *       - $ref: '#/definitions/RequestForm'
 *       - type: object
 *       - properties:
 *           fields:
 *             type: array
 *             items:
 *               allOf:
 *                 - $ref: '#/definitions/GetField'
 *                 - type: object
 *                 - properties:
 *                     typeName:
 *                       type: string
 *                     categoryName:
 *                       type: string
 *           formStatus:
 *             type: string
 *           created_at:
 *             type: string
 *             format: date-time
 *           updated_at:
 *             type: string
 *             format: date-time
 *           deleted_at:
 *             type: string
 *             format: date-time
 *   NewFormField:
 *     type: object
 *     required:
 *       - fieldId
 *       - value
 *     properties:
 *       fieldId:
 *         type: integer
 *       value:
 *         type: string
 *   FormField:
 *     allOf:
 *       - $ref: '#/definitions/RequestForm'
 *       - type: object
 *       - required:
 *         - requestFormId
 *       - properties:
 *           requestFormId:
 *             type: integer
 */


/**
* @swagger
* /api/request-form:
*   get:
*     summary: Returns request forms
*     produces:
*      - application/json
*     tags:
*       - requestForms
*     responses:
*       200:
*         description: Request forms
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/GetRequestForm'
*/
router.get('/', async (req, res, next) => {
  let sql = `SELECT
      form.*,
      status.name AS formStatus,
      ftrf.requestFormId,
      formType.name AS formType,
      GROUP_CONCAT(f.id ORDER BY c.sortOrder, f.sortOrder, c.name, f.name, f.id) as fieldIds
    FROM fieldtorequestform ftrf
    JOIN requestForm form ON (ftrf.requestFormId = form.id)
    JOIN requestFormStatus status ON (form.formStatusId = status.id)
    JOIN requestFormType formType ON (form.formTypeId = formType.id)
    JOIN field f ON (ftrf.fieldId = f.id)
    JOIN fieldCategory c ON (f.categoryId = c.id)
    WHERE form.deleted_at IS NULL
      AND formType.deleted_at IS NULL
    GROUP BY ftrf.requestFormId
    ORDER BY form.created_at DESC`;

  let formData;
  try {
    formData = await db.query(sql);
  } catch (e) {
    next(e);
    return;
  }

  sql = `SELECT
      f.*,
      t.name AS typeName,
      ftrf.requestFormId,
      ftrf.value,
      c.required AS categoryRequired
    FROM field f
    JOIN fieldType t ON (f.typeId = t.id)
    JOIN fieldCategory c ON (f.categoryId = c.id)
    JOIN fieldToRequestForm ftrf ON (ftrf.fieldId = f.id)
    LEFT JOIN autocompleteOptions ao ON (ao.fieldId = f.id AND ao.deleted_at IS NULL)
    WHERE f.deleted_at IS NULL
      AND c.deleted_at IS NULL
      AND ftrf.deleted_at IS NULL
    GROUP BY f.id, ftrf.requestFormId
    ORDER BY c.sortOrder, f.sortOrder, c.name, f.name, f.id`;

  let fieldData;
  try {
    fieldData = await db.query(sql);
  } catch (e) {
    next(e);
    return;
  }

  const fieldMap = {};
  for (let i = 0; i < fieldData.length; i++) {
    const field = fieldData[i];
    fieldMap[`${field.requestFormId}-${field.id}`] = util.cleanFormFieldForOutput(field);
  }

  for (let i = 0; i < formData.length; i++) {
    const form = formData[i];
    const { requestFormId, fieldIds } = form;
    const fields = [];
    const fieldIdsArray = fieldIds.split(',');
    for (let j = 0; j < fieldIdsArray.length; j++) {
      const key = `${requestFormId}-${fieldIdsArray[j]}`;
      fields.push(fieldMap[key]);
    }

    form.fields = util.cleanFieldsForOutput(fields);
    delete form.fieldIds;
  }
  res.send(formData);
});


const getSmallRequestFormSummary = async (id) => {
  return new Promise(async (resolve, reject) => {
    let sql = `SELECT
        f.id,
        f.categoryId,
        f.name,
        f.sortOrder,
        f.dependentOnId,
        form.formStatusId,
        s.name AS formStatusName,
        f.dependentOnValue,
        f.elementOptions,
        c.sortOrder AS categorySortOrder,
        c.name AS categoryName,
        ftrf.value,
        t.name AS typeName,
        formType.name AS formTypeName
      FROM requestForm form
      JOIN requestFormStatus s ON (form.formStatusId = s.id)
      JOIN requestFormType formType ON (form.formTypeId = formType.id)
      JOIN fieldCategory c ON (formType.id = c.formTypeId)
      JOIN field f ON (c.id = f.categoryId AND f.forTableFieldId IS NULL)
      JOIN fieldType t ON (f.typeId = t.id)
      LEFT JOIN fieldToRequestForm ftrf ON (ftrf.requestFormId = form.id AND ftrf.fieldId = f.id AND ftrf.deleted_at IS NULL)
      WHERE form.id = ?
      GROUP BY f.id
      ORDER BY c.sortOrder, f.sortOrder, c.name, f.name, f.id`;
    let params = [id];
    let fields, formStatusId, formStatusName;
    try {
      const results = await db.query(sql, params);
      if (results.length === 0) {
        reject(404);
        return;
      }
      formStatusId = results[0].formStatusId;
      formStatusName = results[0].formStatusName;
      fields = await util.fillInFieldExtrasAndCleanFields(results, true);
    } catch (e) {
      reject(e);
      return;
    }
    const formData = { id, fields, formStatusName, formStatusId };
    resolve(formData);
  });
};

const getRequestFormById = async (id) => {
  return new Promise(async (resolve, reject) => {
    let sql = `SELECT
      f.*,
      status.name AS formStatus,
      c.sortOrder AS categorySortOrder,
      c.name AS categoryName,
      ftrf.value,
      t.name AS typeName,
      ao.fieldId IS NOT NULL AS hasAutocompleteOptions,
      columns.id IS NOT NULL AS hasTableColumns,
      formType.name AS formTypeName
    FROM requestForm form
    JOIN requestFormStatus status ON (form.formStatusId = status.id)
    JOIN requestFormType formType ON (form.formTypeId = formType.id)
    JOIN fieldCategory c ON (formType.id = c.formTypeId)
    JOIN field f ON (c.id = f.categoryId AND f.deleted_at IS NULL)
    JOIN fieldType t ON (f.typeId = t.id)
    LEFT JOIN fieldToRequestForm ftrf ON (ftrf.requestFormId = form.id AND ftrf.fieldId = f.id AND ftrf.deleted_at IS NULL)
    LEFT JOIN autocompleteOptions ao ON (ao.fieldId = f.id AND ao.deleted_at IS NULL)
    LEFT JOIN field columns ON (f.id = columns.forTableFieldId AND columns.deleted_at IS NULL)
    WHERE form.id = ? AND f.forTableFieldId IS NULL
    GROUP BY f.id
    ORDER BY c.sortOrder, f.sortOrder, c.name, f.name, f.id`;
    let params = [id];
    let fields, formStatus;
    try {
      const results = await db.query(sql, params);
      if (results.length === 0) {
        reject(404);
        return;
      }
      formStatus = results[0].formStatus;
      fields = await util.fillInFieldExtrasAndCleanFields(results, true, id);
    } catch (e) {
      reject(e);
      return;
    }
    const formData = { id, fields, formStatus };
    resolve(formData);
  });
};


const fieldIdHasValidValue = (fieldId, value, typeName, autocompleteFieldIdsAndOptions, fieldIdsAndOptions, res) => {
  let validValues = null;
  if (autocompleteFieldIdsAndOptions && autocompleteFieldIdsAndOptions[fieldId]) {
    validValues = autocompleteFieldIdsAndOptions[fieldId].split(',').map(a => a.replace('\"', '"'));
  } else if (fieldIdsAndOptions && fieldIdsAndOptions[fieldId]) {
    validValues = inputCleaningFunctions.outputArrayFunc(fieldIdsAndOptions[fieldId]);
  }

  if (validValues) {
    const specialValueFormat = specialFieldTypeNamesAndValueFormats[typeName];
    if (specialValueFormat) {
      if (specialValueFormat === 'array') {
        for (let i = 0; i < value.length; i++) {
          const v = value[i];
          if (!validValues.includes(v)) {
            res.status(400).send(`Value ${v} is not valid for field ID ${fieldId}`);
            return false;
          }
        }
      }
    } else if (!validValues.includes(value)) {
      res.status(400).send(`Value ${value} is not valid for field ID ${fieldId}`);
      return false;
    }
  }
  return true;
};


const insertIntoHistoryTable = (requestFormId, formState, updatedBy = null, changes = null) => {
  const insertValues = { requestFormId, formState: JSON.stringify(formState) };
  if (updatedBy)
    insertValues.updatedBy = updatedBy;
  if (changes)
    insertValues.changes = JSON.stringify(changes);

  const keys = Object.keys(insertValues);
  const sql = `INSERT INTO requestFormHistory (${keys.join(',')}) VALUES (${'?,'.repeat(keys.length - 1)}?)`;
  try {
    db.query(sql, Object.values(insertValues));
  } catch (e) {
    console.error("Error inserting into history table:");
    console.error(e);
  }
};


/**
* @swagger
* /api/request-form/{requestFormId}:
*   get:
*     summary: Returns a request form
*     produces:
*      - application/json
*     tags:
*       - requestForms
*     parameters:
*       - in: path
*         name: requestFormId
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Request form
*         schema:
*           $ref: '#/definitions/GetRequestForm'
*/
router.get('/:requestFormId', (req, res, next) => {
  const truthy = util.requiredKeysAreTruthy(req.params, ['requestFormId']);
  if (!truthy.success) {
    res.status(400).send(truthy.error);
    return;
  }

  getRequestFormById(req.params.requestFormId).then(formData => {
    res.send(formData);
  }).catch(e => {
    if (e === 404)
      res.status(404).send(`Form with ID ${id} not found`);
    else
      next(e);
  });
});


/**
* @swagger
* /api/request-form:
*   post:
*     summary: Creates a request form
*     produces:
*      - application/json
*     tags:
*       - requestForms
*     parameters:
*       - in: body
*         name: requestForm
*         description: The request form to create. If field type is checkbox or multiselect, value should be an array of strings. Otherwise, it should be a string.  Only formStatusId or formStatusName is required, not both, if a status is passed in. If saving a table row value, the data should be a field ID key, then an object with keys rowId and value.
*         schema:
*           type: object
*           properties:
*             formStatusId:
*               type: integer
*             formStatusName:
*               type: string
*             formTypeId:
*               type: integer
*             fields:
*               type: object
*               example: {"3":"Bees' Knees", "44": {"rowId": 2, "value": "Eye of Newt"}}
*               properties:
*                 fieldId:
*                   type: string
*     responses:
*       200:
*         description: Request form
*         schema:
*           $ref: '#/definitions/GetRequestForm'
*/
router.post('/', async (req, res, next) => {
  const truthy = util.requiredKeysAreTruthy(req.body, ['formTypeId', 'fields']);
  if (!truthy.success) {
    res.status(400).send(truthy.error);
    return;
  }

  const { formTypeId, fields } = req.body;
  let { formStatusId, formStatusName } = req.body;
  const allFieldIdStatements = [];
  let sql, params;

  // If a status is passed in, check if it's valid
  if (!formStatusName && !formStatusId) {
    formStatusName = 'Draft';
  }
  if (formStatusName || formStatusId) {
    sql = `SELECT * FROM requestFormStatus `;
    if (formStatusId) {
      sql += `WHERE id = ?`;
      params = [formStatusId];
    } else {
      sql += `WHERE name = ?`;
      params = [formStatusName];
    }
    try {
      const results = await db.query(sql, params);
      if (!results || !results.length) {
        res.status(400).send(`Form ${formStatusId ? `status ID ${formStatusId}` : `status name ${formStatusName}`} is not valid`);
        return;
      } else if (!formStatusId) {
        formStatusId = results[0].id;
      }
    } catch (e) {
      next(e);
      return;
    }
  }

  // Make sure this data is valid
  const fieldIds = Object.keys(fields);
  params = [];
  const passedColumnFieldIds = [];
  for (let i = 0; i < fieldIds.length; i++) {
    const fieldId = fieldIds[i];
    allFieldIdStatements.push(`SELECT ? AS id FROM DUAL`);
    params.push(fieldId);
    if (fields[fieldId].rowId) {
      passedColumnFieldIds.push(fieldId);
    }
  }

  sql = `SELECT
      GROUP_CONCAT(IF(validFields.id IS NULL, fieldIds.id, NULL)) AS invalid,
      GROUP_CONCAT(IF(validFields.id IS NOT NULL, CONCAT('"', validFields.id, '":"', validFields.typeName, '"'), NULL)) AS fieldTypes,
      GROUP_CONCAT(IF(validFields.id IS NOT NULL, CONCAT('"', validFields.id, '":"', REPLACE(validFields.options, '"', '\"'), '"'), NULL)) AS options,
      GROUP_CONCAT(IF(validFields.id IS NOT NULL AND validFields.typeName = 'autocomplete', CONCAT('"', validFields.id, '":"', validFields.optKey, '"'), NULL)) AS autocompleteFieldIds,
      GROUP_CONCAT(IF(validFields.id IS NOT NULL AND validFields.forTableFieldId IS NOT NULL, validFields.id, NULL)) AS columnFieldIds
    FROM (${allFieldIdStatements.join(' UNION ')}) fieldIds
    LEFT JOIN (
      SELECT DISTINCT f.id, t.name AS typeName, f.options, GROUP_CONCAT(REPLACE(ao.optKey, '"', '\"')) AS optKey, f.forTableFieldId
      FROM field f
      JOIN fieldType t ON (f.typeId = t.id)
      JOIN fieldCategory c ON (f.categoryId = c.id AND c.formTypeId = ? AND c.deleted_at IS NULL)
      LEFT JOIN autocompleteOptions ao ON (f.id = ao.fieldId AND ao.deleted_at IS NULL)
      GROUP BY f.id
    ) validFields ON (validFields.id = fieldIds.id)
    LIMIT 1
  `;
  params.push(formTypeId);
  let fieldIdsAndTypeNames, fieldIdsAndOptions, autocompleteFieldIdsAndOptions;
  try {
    const results = await db.query(sql, params);
    const infoRow = results[0];
    if (infoRow.invalid) {
      res.status(400).send(`Field ID(s) ${infoRow.invalid} is not a valid field for this form type`);
      return;
    } else {
      const { fieldTypes, options, autocompleteFieldIds, columnFieldIds } = infoRow;

      if (passedColumnFieldIds.length) {
        for (let i = 0; i < passedColumnFieldIds.length; i++) {
          let fId = passedColumnFieldIds[i];
          if (!columnFieldIds.includes(fId)) {
            res.status(400).send(`Field ID ${fId} is not a column field and should not have a rowId value with it`);
            return;
          }
        }
      }

      fieldIdsAndTypeNames = JSON.parse(`{${fieldTypes}}`);
      if (options)
        fieldIdsAndOptions = JSON.parse(`{${options}}`);
      if (autocompleteFieldIds)
        autocompleteFieldIdsAndOptions = JSON.parse(`{${autocompleteFieldIds}}`);
    }
  } catch (e) {
    next(e);
    return;
  }

  // The field IDs and status are valid, continue
  try {
    const insertFormData = { formTypeId };
    if (formStatusId)
      insertFormData.formStatusId = formStatusId;
    let results = await db.insert(tableName, insertFormData);
    const requestFormId = results.insertId;
    const deleteFormRecord = () => {
      db.query(`DELETE FROM ?? WHERE id = ?`, [tableName, requestFormId]);
    };

    // Check incoming values for validity with field options
    const cleanedData = [];
    for (let i = 0; i < fieldIds.length; i++) {
      const fieldId = fieldIds[i];
      let value, rowId;
      if (fields[fieldId].rowId) {
        rowId = fields[fieldId].rowId;
        value = fields[fieldId].value;
      } else
        value = fields[fieldId];

      if (!fieldIdHasValidValue(fieldId, value, fieldIdsAndTypeNames[fieldId], autocompleteFieldIdsAndOptions, fieldIdsAndOptions, res)) {
        deleteFormRecord();
        return;
      }
      cleanedData.push(util.cleanFormFieldForInput({ fieldId, value, rowId, typeName: fieldIdsAndTypeNames[fieldId], requestFormId }));
    }

    // Insert the field data
    try {
      await db.insert('fieldToRequestForm', cleanedData);
      getRequestFormById(requestFormId).then(formData => {
        res.send(formData);
        getSmallRequestFormSummary(requestFormId).then(d => {
          insertIntoHistoryTable(requestFormId, d);
        }).catch(e => { });
      }).catch(e => {
        if (e === 404)
          res.status(404).send(`Form with ID ${id} not found`);
        else
          next(e);
      });
    } catch (e) {
      next(e);
      return;
    }

  } catch (e) {
    next(e);
    return;
  }
});


/**
* @swagger
* /api/request-form/{requestFormId}:
*   put:
*     summary: Updates a request form
*     produces:
*      - application/json
*     tags:
*       - requestForms
*     parameters:
*       - in: path
*         name: requestFormId
*         schema:
*           type: integer
*       - in: body
*         name: requestForm
*         description: The request form to update. The body should be an object where the key is the field ID and the value is the value. If saving a table row, the data should be a field ID key, then an object with keys rowId and value. To delete values, put the IDs in an array (see example below).
*         schema:
*           type: object
*           example: {"3":"Bees' Knees", "44": {"rowId": 2, "value": "Eye of Newt"}, "deletes": ["22", "1", {"tableId": "6", "rowId": "2"}]}
*           properties:
*             value:
*               type: string
*     responses:
*       200:
*         description: Request form
*         schema:
*           $ref: '#/definitions/GetRequestForm'
*/
router.put('/:requestFormId', async (req, res, next) => {
  const truthy = util.requiredKeysAreTruthy(req.params, ['requestFormId']);
  if (!truthy.success) {
    res.status(400).send(truthy.error);
    return;
  }

  const { requestFormId } = req.params;
  const { fields, deletes } = req.body;
  const allFieldIdStatements = [];
  let sql, params;

  // If a status is passed in, check if it's valid
  let formStatusId = fields ? fields.formStatusId : null;
  const formStatusName = fields ? fields.formStatusName : null;
  if (fields) {
    delete fields.formStatusId;
    delete fields.formStatusName;
  }
  if (formStatusName || formStatusId) {
    sql = `SELECT
        f.formStatusId IS NOT NULL AS currentStatus,
        s.*
      FROM requestFormStatus s
      LEFT JOIN requestForm f ON (s.id = f.formStatusId AND f.id = ?) `;
    if (formStatusId) {
      sql += `WHERE s.id = ? `;
      params = [requestFormId, formStatusId];
    } else {
      sql += `WHERE s.name = ? `;
      params = [requestFormId, formStatusName];
    }
    sql += `LIMIT 1`;
    try {
      const results = await db.query(sql, params);
      if (!results || !results.length) {
        res.status(400).send(`Form ${formStatusId ? `status ID ${formStatusId}` : `status name ${formStatusName}`} is not valid`);
        return;
      } else if (!formStatusId) {
        formStatusId = results[0].id;
      }

      if (results[0].currentStatus) {
        formStatusId = undefined;
      }
    } catch (e) {
      next(e);
      return;
    }
  }

  // Check which fields are new, which are being updated, and which are invalid for this form
  params = [];
  let updates, inserts;
  const fieldIds = fields ? Object.keys(fields) : [];
  if (fieldIds.length) {
    let passedColumnFieldIds = [];
    for (let i = 0; i < fieldIds.length; i++) {
      const fieldId = fieldIds[i];
      if (isNaN(fieldId))
        continue;
      allFieldIdStatements.push(`SELECT ? AS id FROM DUAL`);
      params.push(fieldId);
      if (fields[fieldId].rowId) {
        passedColumnFieldIds.push(fieldId);
      }
    }

    sql = `SELECT
      GROUP_CONCAT(IF(validFields.id IS NULL, fieldIds.id, NULL)) AS invalidFields,
      GROUP_CONCAT(IF(validFields.id IS NOT NULL, CONCAT('"', validFields.id, '":"', REPLACE(validFields.options, '"', '\"'), '"'), NULL)) AS options,
      GROUP_CONCAT(IF(fieldsWithValues.id IS NOT NULL, CONCAT('"', fieldIds.id, '":"', REPLACE(fieldsWithValues.typeName, '"', '\"'), '"'), NULL)) AS updateFields,
      GROUP_CONCAT(IF(fieldsWithValues.id IS NOT NULL AND fieldsWithValues.rowId IS NOT NULL, CONCAT('"', fieldIds.id, '":{', fieldsWithValues.jsonFormatRows, '}'), NULL)) AS columnAndRowValues,
      GROUP_CONCAT(IF(fieldsWithValues.id IS NOT NULL AND fieldsWithValues.rowId IS NULL, CONCAT('"', fieldIds.id, '":"', REPLACE(REPLACE(fieldsWithValues.value, '"', '\"'), ';', '\;'), '"'), NULL)) AS currentUpdateValues,
      GROUP_CONCAT(IF(fieldsWithValues.id IS NULL AND validFields.id IS NOT NULL, CONCAT('"', fieldIds.id, '":"', REPLACE(validFields.typeName, '"', '\"'), '"'), NULL)) AS insertFields,
      GROUP_CONCAT(IF(validFields.id IS NOT NULL AND validFields.typeName = 'autocomplete', CONCAT('"', validFields.id, '":"', validFields.optKey, '"'), NULL)) AS autocompleteFieldIds,
      GROUP_CONCAT(IF(validFields.id IS NOT NULL AND validFields.forTableFieldId IS NOT NULL, validFields.id, NULL)) AS columnFieldIds
    FROM (${allFieldIdStatements.join(' union ')}) fieldIds
    LEFT JOIN (
      SELECT DISTINCT f.id, t.name AS typeName, IF(ftrf.rowId = 0 OR ftrf.rowId IS NULL, NULL, GROUP_CONCAT('"', ftrf.rowId, '":"', REPLACE(REPLACE(ftrf.value, '"', '\"'), ';', '\;'), '"')) AS jsonFormatRows, ftrf.value, IF(ftrf.rowId = 0, NULL, ftrf.rowId) AS rowId
      FROM field f
      JOIN fieldType t ON (f.typeId = t.id)
      JOIN fieldCategory c ON (f.categoryId = c.id)
      JOIN requestForm form ON (form.formTypeId = c.formTypeId AND form.id = ?)
      JOIN fieldToRequestForm ftrf ON (f.id = ftrf.fieldId AND form.id = ftrf.requestFormId)
      GROUP BY f.id
    ) fieldsWithValues ON (fieldIds.id = fieldsWithValues.id)
    LEFT JOIN (
      SELECT DISTINCT f.id, form.id AS formId, t.name AS typeName, f.options, GROUP_CONCAT(REPLACE(ao.optKey, '"', '\"')) AS optKey, f.forTableFieldId
      FROM field f
      JOIN fieldType t ON (f.typeId = t.id)
      JOIN fieldCategory c ON (f.categoryId = c.id)
      JOIN requestForm form ON (form.formTypeId = c.formTypeId AND form.id = ?)
      LEFT JOIN autocompleteOptions ao ON (f.id = ao.fieldId AND ao.deleted_at IS NULL)
      GROUP BY f.id
    ) validFields ON (fieldIds.id = validFields.id)
    GROUP BY validFields.formId`;
    params.push(requestFormId, requestFormId);

    try {
      const results = await db.query(sql, params);
      const row = results[0];
      if (row.invalidFields) {
        res.status(400).send(`Field ID(s) ${row.invalidFields} is not a valid field for this form type`);
        return;
      }

      let fieldIdsAndOptions, autocompleteFieldIdsAndOptions;
      if (row.columnFieldIds && passedColumnFieldIds.length) {
        const { columnFieldIds } = row;
        for (let i = 0; i < passedColumnFieldIds.length; i++) {
          let fId = passedColumnFieldIds[i];
          if (!columnFieldIds.includes(fId)) {
            res.status(400).send(`Field ID ${fId} is not a column field and should not have a rowId value with it`);
            return;
          }
        }
      }
      if (row.options)
        fieldIdsAndOptions = JSON.parse(`{${row.options}}`);
      if (row.autocompleteFieldIds)
        autocompleteFieldIdsAndOptions = JSON.parse(`{${row.autocompleteFieldIds}}`);

      let updateFields, insertFields, columnAndRowValues;
      if (row.updateFields)
        updateFields = JSON.parse(`{${row.updateFields}}`);
      if (row.insertFields)
        insertFields = JSON.parse(`{${row.insertFields}}`);
      if (row.columnAndRowValues)
        columnAndRowValues = JSON.parse(`{${row.columnAndRowValues}}`);

      if (columnAndRowValues) {
        const fieldIds = Object.keys(columnAndRowValues);
        for (let i = 0; i < fieldIds.length; i++) {
          const fieldId = fieldIds[i];
          const currentRowValues = columnAndRowValues[fieldId];
          const passedRowId = fields[fieldId].rowId;
          const typeName = updateFields[fieldId];
          const value = util.cleanFormFieldForInput({ value: fields[fieldId].value, typeName }).value;
          delete updateFields[fieldId];
          const field = { typeName, value: fields[fieldId].value, rowId: passedRowId, requestFormId, fieldId };
          if (!currentRowValues[passedRowId]) {
            if (!inserts)
              inserts = [];
            inserts.push(field);
          } else if (currentRowValues[passedRowId] !== value) {
            if (!updates)
              updates = [];
            updates.push(field);
          }
        }
      }

      if (updateFields) {
        if (!updates)
          updates = [];
        const updateFieldIds = Object.keys(updateFields);
        const currentValues = row.currentUpdateValues ? JSON.parse(`{${row.currentUpdateValues}}`) : {};
        for (let i = 0; i < updateFieldIds.length; i++) {
          const fieldId = updateFieldIds[i];
          const typeName = updateFields[fieldId];
          const value = fields[fieldId];
          const cleanedValue = util.cleanFormFieldForInput({ value, typeName }).value;
          if (currentValues[fieldId] && value !== currentValues[fieldId]) {
            if (!fieldIdHasValidValue(fieldId, value, typeName, autocompleteFieldIdsAndOptions, fieldIdsAndOptions, res)) {
              return;
            }
            updates.push({
              requestFormId,
              fieldId,
              typeName,
              value: cleanedValue
            });
          }
        }
      }

      if (insertFields) {
        if (!inserts)
          inserts = [];
        const insertFieldIds = Object.keys(insertFields);
        for (let i = 0; i < insertFieldIds.length; i++) {
          const fieldId = insertFieldIds[i];
          const typeName = insertFields[fieldId];

          let value, rowId;
          if (fields[fieldId].rowId) {
            rowId = fields[fieldId].rowId;
            value = fields[fieldId].value;
          } else
            value = fields[fieldId];

          if (!fieldIdHasValidValue(fieldId, value, typeName, autocompleteFieldIdsAndOptions, fieldIdsAndOptions, res)) {
            return;
          }
          inserts.push({
            requestFormId,
            fieldId,
            typeName,
            rowId,
            value: util.cleanFormFieldForInput({ value, typeName }).value
          });
        }
      }
    } catch (e) {
      next(e);
      return;
    }
  }

  const promisesArray = [];
  if (updates && updates.length) {
    try {
      promisesArray.push(db.multiUpdate('fieldToRequestForm', updates.map(util.cleanFormFieldForInput), { whereFields: ['requestFormId', 'fieldId', 'rowId'] }));
    } catch (e) {
      next(e);
      return;
    }
  }

  if (inserts && inserts.length) {
    try {
      promisesArray.push(db.insert('fieldToRequestForm', inserts.map(util.cleanFormFieldForInput)));
    } catch (e) {
      next(e);
      return;
    }
  }

  if (deletes && deletes.length) {
    const baseSql = `UPDATE fieldToRequestForm SET deleted_at = NOW() WHERE requestFormId = ? AND fieldId = ?`;
    const baseParams = [requestFormId];
    for (let i = 0; i < deletes.length; i++) {
      const d = deletes[i];
      let sql = baseSql;
      let params = [...baseParams];
      if (typeof d === "object") {
        sql += ' AND rowId = ?';
        params.push(d.tableId);
        params.push(d.rowId);
      } else {
        params.push(d);
      }
      try {
        promisesArray.push(db.query(sql, params));
      } catch (e) {
        next(e);
        return;
      }
    }
  }

  if (formStatusId) {
    try {
      promisesArray.push(db.update('requestForm', requestFormId, { formStatusId }));
    } catch (e) {
      next(e);
      return;
    }
  }

  Promise.all(promisesArray)
    .then(r => {
      getRequestFormById(requestFormId).then(formData => {
        res.send(formData);
        if (inserts || updates || formStatusId) {
          // TODO include who created request
          const updatedBy = null;
          let changes = null;
          if (inserts && inserts.length) {
            changes = { inserts };
          }
          if (updates && updates.length) {
            if (!changes)
              changes = {};
            changes.updates = updates;
          }
          if (formStatusId) {
            if (!changes)
              changes = {};
            if (!changes.updates)
              changes.updates = [];
            changes.updates.push({ formStatusId });
          }
          if (changes) {
            try {
              getSmallRequestFormSummary(requestFormId).then(d => {
                insertIntoHistoryTable(requestFormId, d, updatedBy, changes);
              }).catch(e => { });
            } catch (e) {
              next(e);
              return;
            }
          }
        }
      }).catch(e => {
        if (e === 404)
          res.status(404).send(`Form with ID ${id} not found`);
        else
          next(e);
      });
    }).catch(next);
});


/**
* @swagger
* /api/request-form/{requestFormId}:
*   delete:
*     summary: Deletes a request form type
*     produces:
*      - application/json
*     tags:
*       - requestForms
*     parameters:
*       - name: requestFormId
*         in: path
*         schema:
*           type: integer
*         required: true
*     responses:
*       200:
*         description: Success confirmation
*         schema:
*           type: string
*           properties:
*             success:
*               type: boolean
*/
router.delete('/:requestFormId', (req, res, next) => {
  util.commonDelete(tableName, 'requestFormId', req, res, next)
    .then(async () => {
      const requestFormId = req.params.requestFormId;
      const sql = `SELECT deleted_at FROM requestForm WHERE id = ?`;
      let formData;
      try {
        formData = await db.query(sql, requestFormId);
      } catch (e) {
        console.error('Could not fetch deleted_at time: ', e);
        return;
      }
      if (!formData || !formData.length) {
        console.error(`Could not find form data to insert into deletion history table with ID ${requestFormId}`);
        return;
      }

      // TODO add updatedBy
      const updatedBy = null;
      const changes = { deleted_at: formData[0].deleted_at };
      getSmallRequestFormSummary(requestFormId).then(d => {
        insertIntoHistoryTable(requestFormId, d, updatedBy, changes);
      }).catch(e => { });
    }).catch();
});


module.exports = {
  endpoint: '/api/request-form',
  router
};
