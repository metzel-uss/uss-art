const router = require('express').Router();
const db = require('../util/db');
const util = require('../util/util');
const inputCleaningFunctions = require('../util/inputCleaningFunctions');

const tableName = 'field';
const fillableFields = ['name', 'categoryId', 'sortOrder', 'typeId', 'dependentOnId', 'dependentOnValue', 'options', 'elementOptions', 'required', 'requiredErrorMessage', 'forTableFieldId'];
const requiredOnInsertFields = ['name', 'categoryId', 'sortOrder', 'typeId'];


/**
 * @swagger
 *
 * definitions:
 *   NewField:
 *     type: object
 *     required:
 *       - categoryId
 *       - name
 *       - sortOrder
 *       - typeId
 *     properties:
 *       categoryId:
 *         type: integer
 *       name:
 *         type: string
 *       sortOrder:
 *         type: integer
 *       typeId:
 *         type: integer
 *       dependentOnId:
 *         type: integer
 *       forTableFieldId:
 *         type: integer
 *       dependentOnValue:
 *         type: array
 *         items:
 *           type: string
 *       options:
 *         type: array
 *         items:
 *           type: string
 *       elementOptions:
 *         type: object
 *       required:
 *         type: integer
 *       requiredErrorMessage:
 *         type: string
 *   Field:
 *     allOf:
 *       - $ref: '#/definitions/NewField'
 *       - type: object
 *       - properties:
 *           categoryRequired:
 *             type: integer
 *           id:
 *             type: integer
 *   GetField:
 *     allOf:
 *       - $ref: '#/definitions/Field'
 *       - type: object
 *       - properties:
 *           typeName:
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
 */

const getFieldById = id => {
  return new Promise(async (resolve, reject) => {
    let result;
    try {
      result = await db.query(`SELECT 
          f.id,
          f.categoryId,
          f.name,
          f.sortOrder,
          f.typeId,
          f.dependentOnId,
          f.dependentOnValue,
          f.options,
          ao.optKey IS NOT NULL AS hasAutocompleteOptions,
          tableField.id IS NOT NULL AS hasTableColumns,
          tableParent.id IS NOT NULL AS isTableColumn,
          f.elementOptions,
          f.required,
          f.requiredErrorMessage,
          f.created_at,
          f.updated_at,
          f.deleted_at,
          t.name AS typeName,
          c.required AS categoryRequired,
          tableParent.id AS forTableFieldId
        FROM field f
        JOIN fieldType t ON (f.typeId = t.id)
        JOIN fieldCategory c ON (f.categoryId = c.id)
        LEFT JOIN autocompleteOptions ao ON (f.id = ao.fieldId AND ao.deleted_at IS NULL AND t.name = 'autocomplete')
        LEFT JOIN field tableField ON (f.id = tableField.forTableFieldId AND tableField.deleted_at IS NULL AND t.name = 'table')
        LEFT JOIN field tableParent ON (f.forTableFieldId = tableParent.id AND tableField.deleted_at IS NULL)
        WHERE f.id = ?
        GROUP BY f.id
      `, [id]);
      if (result && result.length) {
        result = result[0];
      } else {
        reject(`Could not find field with ID ${id}`);
      }
    } catch (e) {
      reject(e);
      return;
    }

    if (result.hasAutocompleteOptions) {
      let autocompleteOptions;
      try {
        autocompleteOptions = await db.query(`SELECT
            CONCAT('"', REPLACE(optKey, '"', '\"'), '":"', REPLACE(value, '"', '\"'), '"') AS jsonFormat
          FROM autocompleteOptions ao
          WHERE fieldId = ? AND deleted_at IS NULL
        `, [id]);
      } catch (e) {
        reject(e);
        return;
      }

      let autocompleteOptionsString = '{';
      for (let i = 0; i < autocompleteOptions.length; i++) {
        autocompleteOptionsString += `${i === 0 ? '' : ','}${autocompleteOptions[i].jsonFormat}`;
      }
      autocompleteOptionsString += '}';
      result.autocompleteOptions = JSON.parse(autocompleteOptionsString);
    }
    else if (result.hasTableColumns) {
      let tableData;
      try {
        tableData = await db.query(`SELECT
            f.id,
            f.name,
            f.sortOrder,
            f.typeId,
            f.dependentOnId,
            f.dependentOnValue,
            f.options,
            f.elementOptions,
            f.required,
            f.requiredErrorMessage,
            t.name AS typeName
          FROM field f
          JOIN fieldType t ON (f.typeId = t.id)
          WHERE f.forTableFieldId = ?
            AND f.deleted_at IS NULL
          ORDER BY f.sortOrder
        `, [id]);
      } catch (e) {
        reject(e);
        return;
      }
      result.columns = util.cleanFieldsForOutput(tableData);
    }

    resolve(result);
  });
};


/**
* @swagger
* /api/field/{fieldId}:
*   get:
*     summary: Returns a field
*     produces:
*      - application/json
*     tags:
*       - fields
*     parameters:
*       - in: path
*         name: fieldId
*         description: A field ID
*         schema:
*           type: integer
*     responses:
*       200:
*         description: The field
*         schema:
*           $ref: '#/definitions/GetField'
*/
router.get('/:fieldId', async (req, res, next) => {
  const id = req.params.fieldId;
  if (!id) {
    res.json({});
    return;
  }

  try {
    const field = await getFieldById(id);
    res.json(util.cleanFieldsForOutput([field])[0]);
  } catch (e) {
    next(e);
  }
});


/**
* @swagger
* /api/field:
*   get:
*     summary: Returns fields
*     produces:
*      - application/json
*     tags:
*       - fields
*     parameters:
*       - in: query
*         name: formType
*         description: A form type filter
*         schema:
*           type: string
*     responses:
*       200:
*         description: Fields
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/GetField'
*/
router.get('/', async (req, res, next) => {
  let sql = `SELECT
      f.*,
      ao.fieldId IS NOT NULL AS hasAutocompleteOptions,
      tableField.id IS NOT NULL AS hasTableColumns,
      t.label AS typeLabel,
      t.name AS typeName,
      c.name AS categoryName,
      c.required AS categoryRequired
    FROM field f
    JOIN fieldType t ON (f.typeId = t.id)
    JOIN fieldCategory c ON (f.categoryId = c.id AND c.deleted_at IS NULL)
    JOIN requestFormType formType ON (c.formTypeId = formType.id AND formType.deleted_at IS NULL`;
  const params = [];
  if (req.query.formType) {
    sql += ` AND formType.id = ? `;
    params.push(req.query.formType);
  }
  sql += `)
    LEFT JOIN autocompleteOptions ao ON (f.id = ao.fieldId AND ao.deleted_at IS NULL AND t.name = 'autocomplete')
    LEFT JOIN field tableField ON (f.id = tableField.forTableFieldId AND tableField.deleted_at IS NULL AND t.name = 'table')
    LEFT JOIN field tableParent ON (f.forTableFieldId = tableParent.id AND tableField.deleted_at IS NULL)
    WHERE f.deleted_at IS NULL AND IF(tableParent.id IS NOT NULL, tableParent.deleted_at, NULL) IS NULL
    GROUP BY f.id
    ORDER BY c.sortOrder ASC, f.sortOrder ASC, c.name ASC, f.name ASC, f.id ASC
  `;
  let fields;
  try {
    const result = await db.query(sql, params);
    fields = await util.fillInFieldExtrasAndCleanFields(result);
  } catch (e) {
    next(e);
    return;
  }
  res.send(fields);
});


/**
* @swagger
* /api/field:
*   post:
*     summary: Creates a field
*     produces:
*      - application/json
*     tags:
*       - fields
*     parameters:
*       - in: body
*         name: field
*         description: The field to create.  "elementOptions" is mostly for front-end field variables, such as field width.  The exceptions are currently minDate and maxDate.  Valid min/max date values are "today" and "moment-#-dayMonthYearEtc" (see Moment JS's documentation on date math; this format parses into `moment().add(#, 'dayMonthYearEtc');`). Options for the autocomplete field type should be an object
*         schema:
*           $ref: '#/definitions/NewField'
*     responses:
*       200:
*         description: Field
*         schema:
*           $ref: '#/definitions/GetField'
*/
router.post('/', async (req, res, next) => {
  if (!req.body || !req.body.typeId) {
    res.status(400).send("typeId field is empty");
    return;
  }

  // Check what field type this is
  const { typeId } = req.body;
  let sql = `SELECT
      t.name AS typeName
    FROM fieldType t
    WHERE t.id = ?
  `;

  let fieldTypeName;
  try {
    const result = await db.query(sql, [typeId]);
    if (!result || !result.length || !result[0].typeName) {
      res.status(404).send(`Could not find a field type with ID ${typeId}`);
      return;
    }
    fieldTypeName = result[0].typeName;
  } catch (e) {
    next(e);
    return;
  }

  // Make sure the parent field is a table
  if (req.body.forTableFieldId) {
    try {
      const result = await db.query(`SELECT f.id
        FROM field f
        JOIN fieldType t ON (f.typeId = t.id AND t.name = 'table')
        WHERE f.id = ?`, [req.body.forTableFieldId]);
      if (!result || !result.length || !result[0].id) {
        res.status(404).send(`Field ${req.body.forTableFieldId} is not a table; you cannot make this field its child!`);
        return;
      }
    } catch (e) {
      next(e);
      return;
    }
  }

  let newFillableFields = fillableFields;
  let newRequiredOnInsertFields = requiredOnInsertFields;
  // If it's an autocomplete field, don't insert the options into field table, but make sure the field is defined
  if (fieldTypeName === 'autocomplete') {
    newFillableFields = fillableFields.filter(f => f !== 'options');
    newRequiredOnInsertFields = newRequiredOnInsertFields.filter(f => f !== 'options');
    if (!req.body.options) {
      res.status(400).send("Options field not defined");
      return;
    }
  }

  util.commonInsert(tableName, newRequiredOnInsertFields, newFillableFields, req, res, next, newId => {
    getFieldById(newId)
      .then(async (newField) => {
        const fieldId = newField.id;

        const rollbackInsert = (e) => {
          db.query(`DELETE FROM field WHERE id = ?`, [fieldId]);
          next(e);
        };

        if (fieldTypeName === 'autocomplete') {
          const { options } = req.body;
          const keys = Object.keys(options);
          sql = `INSERT INTO autocompleteOptions (fieldId, optKey, value) VALUES ${'(?, ?, ?),'.repeat(keys.length - 1)}(?, ?, ?)`;
          const params = [];
          let autocompleteOptions = {};
          try {
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              const value = options[key];
              autocompleteOptions[key] = value;
              params.push(fieldId);
              params.push(key);
              params.push(value);
            }
          } catch (e) {
            return rollbackInsert(e);
          }

          let result;
          try {
            result = await db.query(sql, params);
          } catch (e) {
            return rollbackInsert(e);
          }

          if (result && result.affectedRows) {
            newField.hasAutocompleteOptions = 1;
            newField.autocompleteOptions = autocompleteOptions;
            res.json(util.cleanFieldsForOutput([newField])[0]);
          } else {
            rollbackInsert("Could not insert autocomplete fields!");
          }
        } else {
          res.json(util.cleanFieldsForOutput([newField])[0]);
        }
      }).catch(next);
  }, util.cleanFieldsForInput, true);
});


/**
* @swagger
* /api/field/bulk-sortorder-update:
*   put:
*     summary: Updates the sort orders of multiple fields
*     produces:
*      - application/json
*     tags:
*       - fields
*     parameters:
*       - name: fields
*         in: body
*         description: The field IDs and new sort orders.  The keys of the object should be the field IDs, and the values should be the sort orders.
*         schema:
*           type: object
*           properties:
*             fieldId:
*               type: integer
*     responses:
*       200:
*         description: Field
*         schema:
*           $ref: '#/definitions/Field'
*/
router.put('/bulk-sortorder-update', async (req, res, next) => {
  const fieldIdsAndSortOrders = req.body;
  const fieldIds = Object.keys(fieldIdsAndSortOrders);
  const promisesArray = [];
  for (let i = 0; i < fieldIds.length; i++) {
    const id = fieldIds[i];
    promisesArray.push(db.update(tableName, id, { sortOrder: fieldIdsAndSortOrders[id] }));
  }

  Promise.all(promisesArray).then(async () => {
    let sql = `SELECT
      f.*,
      ao.fieldId IS NOT NULL AS hasAutocompleteOptions,
      t.label AS typeLabel,
      t.name AS typeName,
      c.name AS categoryName,
      c.required AS categoryRequired
    FROM field f
    JOIN fieldType t ON (f.typeId = t.id)
    JOIN fieldCategory c ON (f.categoryId = c.id AND c.deleted_at IS NULL)
    JOIN requestFormType formType ON (c.formTypeId = formType.id AND formType.deleted_at IS NULL)
    LEFT JOIN autocompleteOptions ao ON (f.id = ao.fieldId AND ao.deleted_at IS NULL AND t.name = 'autocomplete')
    WHERE f.deleted_at IS NULL AND f.id IN (${'?,'.repeat(fieldIds.length - 1)}?)
    GROUP BY f.id
    ORDER BY c.sortOrder ASC, f.sortOrder ASC, c.name ASC, f.name ASC, f.id ASC`;
    let fields;
    try {
      const result = await db.query(sql, fieldIds);
      fields = await util.fillInFieldExtrasAndCleanFields(result);
    } catch (e) {
      next(e);
      return;
    }
    res.send(fields);
  }).catch(next);
});


/**
* @swagger
* /api/field/{fieldId}:
*   put:
*     summary: Updates a field
*     produces:
*      - application/json
*     tags:
*       - fields
*     parameters:
*       - name: fieldId
*         in: path
*         schema:
*           type: integer
*         required: true
*       - name: field
*         in: body
*         description: The field to update.  See the post request for more details on parameters
*         schema:
*           $ref: '#/definitions/Field'
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/NewField'
*     responses:
*       200:
*         description: Field
*         schema:
*           $ref: '#/definitions/Field'
*/
router.put('/:fieldId', async (req, res, next) => {
  const id = req.params.fieldId;

  // Check what field type this is
  const { typeId = 0 } = req.body;
  let sql = `SELECT
      originalField.forTableFieldId AS originalForTableFieldId,
      originalField.name AS originalTypeName,
      originalField.hasAutocompleteOptions,
      newFieldType.name AS newTypeName,
      GROUP_CONCAT(originalField.childFields) AS childFields
    FROM (
      SELECT
        t.name,
        ao.fieldId IS NOT NULL AS hasAutocompleteOptions,
        f.forTableFieldId,
        childFields.id AS childFields
      FROM fieldType t
      JOIN field f ON (f.typeId = t.id)
      LEFT JOIN autocompleteOptions ao ON (f.id = ao.fieldId)
      LEFT JOIN field childFields ON (f.id = childFields.forTableFieldId AND childFields.deleted_at IS NULL)
      WHERE f.id = ?
    ) originalField
    LEFT JOIN (
      SELECT
        t.name
      FROM fieldType t
      WHERE t.id = ?
    ) newFieldType ON (1 = 1)`;
  let params = [id, typeId];

  let newTypeName, originalTypeName, hasAutocompleteOptions, originalForTableFieldId, childFields;
  try {
    const result = await db.query(sql, params);
    if (!result || !result.length || !result[0].originalTypeName) {
      res.status(404).send(`Could not find a field with ID ${id}`);
      return;
    }
    childFields = result[0].childFields || null;
    originalForTableFieldId = result[0].originalForTableFieldId || null;
    hasAutocompleteOptions = !!(result[0].hasAutocompleteOptions) || null;
    originalTypeName = result[0].originalTypeName;
    newTypeName = result[0].newTypeName || null;
    if (newTypeName === originalTypeName)
      newTypeName = null;
  } catch (e) {
    next(e);
    return;
  }

  // Do any special stuff here if the type is changing
  if (newTypeName !== originalTypeName) {
    // Make sure options are defined if field is becoming autocomplete
    if (newTypeName === 'autocomplete') {
      const { options = null } = req.body;
      if (!options) {
        res.status(400).send(`Options are required for autocomplete fields`);
        return;
      }
    }
  }

  // If field is becoming a table, make sure forTableFieldId is falsy
  if (newTypeName === 'table') {
    if (req.body.forTableFieldId) {
      res.status(400).send(`forTableFieldId cannot be defined for tables!`);
      return;
    } else {
      req.body.forTableFieldId = null;
    }
  }
  // If field was a table and is becoming something else, make sure it has no undeleted child fields
  else if (newTypeName && newTypeName !== 'table' && originalTypeName === 'table' && childFields && childFields.length) {
    res.status(400).send(`Please delete or move this table's fields before changing its type!`);
    return;
  }

  if (((!newTypeName && originalTypeName === 'table') || newTypeName === 'table') && req.body.forTableFieldId) {
    res.status(400).send(`You cannot make tables the children of other tables!`);
    return;
  }

  // Make sure the parent field is a table
  if (req.body.forTableFieldId && parseInt(originalForTableFieldId) !== parseInt(req.body.forTableFieldId)) {
    try {
      const result = await db.query(`SELECT f.id
        FROM field f
        JOIN fieldType t ON (f.typeId = t.id AND t.name = 'table')
        WHERE f.id = ?`, [req.body.forTableFieldId]);
      if (!result || !result.length || !result[0].id) {
        res.status(404).send(`Field ${req.body.forTableFieldId} is not a table; you cannot make this field its child!`);
        return;
      }
    } catch (e) {
      next(e);
      return;
    }
  }

  // Handle autocomplete options
  const { options = null } = req.body;
  let didAutocompleteOptions = false;
  if (
    (newTypeName !== originalTypeName && newTypeName === 'autocomplete') ||
    ((!newTypeName || newTypeName === originalTypeName) && originalTypeName === 'autocomplete' && options)
  ) {
    delete req.body.options;
    didAutocompleteOptions = true;
    const handleAutocompleteOptions = () => {
      return new Promise(async (resolve, reject) => {
        const insertAutocompleteOptions = (insertOptions = {}) => {
          return new Promise((resolve, reject) => {
            const keys = Object.keys(insertOptions);
            if (!keys.length) {
              resolve();
              return;
            }
            const sql = `INSERT INTO autocompleteOptions (fieldId, optKey, value) VALUES ${'(?,?,?),'.repeat(keys.length - 1)}(?,?,?)`;
            const params = [];
            try {
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = insertOptions[key];
                params.push(id);
                params.push(key);
                params.push(value);
              }
            } catch (e) {
              reject(e);
              return;
            }

            db.query(sql, params).then(resolve).catch(reject);
          });
        };

        const updateAutocompleteOptions = (updateOptions = {}) => {
          return new Promise((resolve, reject) => {
            const keys = Object.keys(updateOptions);
            if (!keys.length) {
              resolve();
              return;
            }
            const sql = `UPDATE autocompleteOptions SET value = ?, deleted_at = NULL WHERE optKey = ? AND fieldId = ?`;
            const promisesArray = [];
            try {
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = updateOptions[key];
                promisesArray.push(db.query(sql, [value, key, id]));
              }
            } catch (e) {
              reject(e);
              return;
            }
            Promise.all(promisesArray)
              .then(resolve).catch(reject);
          });
        };

        const deleteAutocompleteOptions = (deleteOptions = {}) => {
          return new Promise((resolve, reject) => {
            const keys = Object.keys(deleteOptions);
            if (!keys.length) {
              resolve();
              return;
            }
            const sql = `UPDATE autocompleteOptions SET deleted_at = NOW() WHERE optKey = ? AND fieldId = ?`;
            const promisesArray = [];
            try {
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                promisesArray.push(db.query(sql, [key, id]));
              }
            } catch (e) {
              reject(e);
              return;
            }
            Promise.all(promisesArray)
              .then(resolve).catch(reject);
          });
        };


        if (hasAutocompleteOptions) {
          sql = `SELECT
              optKey,
              value
            FROM autocompleteOptions ao
            WHERE fieldId = ?
            ORDER BY fieldId`;
          try {
            result = await db.query(sql, [id]);
          } catch (e) {
            next(e);
            return;
          }

          const existingAutocompleteOptions = {};
          for (let i = 0; i < result.length; i++) {
            const opt = result[i];
            existingAutocompleteOptions[opt.optKey] = opt.value;
          }

          const insertOptions = {};
          const updateOptions = {};
          const deleteOptions = { ...existingAutocompleteOptions };
          const optionKeys = Object.keys(options);
          for (let i = 0; i < optionKeys.length; i++) {
            const key = optionKeys[i];
            const value = options[key];

            if (existingAutocompleteOptions[key]) {
              delete deleteOptions[key];
              if (value !== existingAutocompleteOptions[key]) {
                updateOptions[key] = value;
              }
            } else {
              insertOptions[key] = value;
            }
          }
          const promisesArray = [
            insertAutocompleteOptions(insertOptions),
            updateAutocompleteOptions(updateOptions),
            deleteAutocompleteOptions(deleteOptions)
          ];
          Promise.all(promisesArray)
            .then(resolve).catch(reject);
        }

        else {
          insertAutocompleteOptions(options).then(resolve).catch(reject);
        }
      });
    };
    try {
      await handleAutocompleteOptions();
    } catch (e) {
      next(e);
      return;
    }
  }

  let doCommonUpdate = true;
  if (didAutocompleteOptions) {
    doCommonUpdate = false;
    for (let i = 0; i < fillableFields.length; i++) {
      const fieldName = fillableFields[i];
      if (req.body[fieldName] !== undefined) {
        doCommonUpdate = true;
        break;
      }
    }
  }

  if (doCommonUpdate) {
    util.commonUpdate(tableName, fillableFields, 'fieldId', req, res, next, updatedId => {
      getFieldById(updatedId)
        .then(field => {
          res.json(util.cleanFieldsForOutput([field])[0]);
        }).catch(next);
    }, util.cleanFieldsForInput, true);
  } else {
    getFieldById(id)
      .then(field => {
        res.json(util.cleanFieldsForOutput([field])[0]);
      }).catch(next);
  }
});


/**
* @swagger
* /api/field/{fieldId}:
*   delete:
*     summary: Deletes a field
*     produces:
*      - application/json
*     tags:
*       - fields
*     parameters:
*       - name: fieldId
*         in: path
*         schema:
*           type: integer
*         required: true
*     responses:
*       200:
*         description: Success confirmation
*         schema:
*           type: object
*           properties:
*             success:
*               type: boolean
*/
router.delete('/:fieldId', (req, res, next) => {
  util.commonDelete(tableName, 'fieldId', req, res, next);
});

module.exports = {
  endpoint: '/api/field',
  router
};
