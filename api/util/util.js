const moment = require('moment');
const specialFormTypeFields = require('./specialFormTypeFields');
const formInputFields = require('./formInputFields');
let db = require('./db');

// To fix old DB object created before all of DB's functions were intialized
const getDB = () => {
  if (!db.update || !db.insert) {
    db = require('./db');
    return db;
  } else
    return db;
};

const cleanUniqueKey = uniqueKey => {
  if (typeof uniqueKey !== 'string') return uniqueKey;
  return uniqueKey.replace(/\s+/g, "_").toUpperCase();
};

const requiredKeysAreTruthy = (parameters, requiredKeyList) => {
  if (!parameters)
    return { success: false, error: "No parameters found" };
  for (let i = 0; i < requiredKeyList.length; i++) {
    const key = requiredKeyList[i];
    if (!parameters[key])
      return { success: false, error: `${key.charAt(0).toUpperCase() + key.slice(1)} not specified` };
  }
  return { success: true };
};

const getNowUTC = () => {
  return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
};

const getUpdateFieldsFromRequestBody = (requestBody, fillableFields, fieldCleaningFunction = null) => {
  let data = {};
  for (let i = 0; i < fillableFields.length; i++) {
    const fieldName = fillableFields[i];
    if (requestBody[fieldName] !== undefined)
      data[fieldName] = requestBody[fieldName];
  }

  if (fieldCleaningFunction)
    data = fieldCleaningFunction([data])[0];

  if (Object.keys(data).length === 0) {
    return { success: false, error: "No non-empty update fields" };
  } else {
    return { success: true, data };
  }
};

const commonUpdate = (tableName, fillableFields, idFieldName, req, res, next, afterInsertCallback = null, fieldCleaningFunction = null, onlyReturnId = false, customConnection = null) => {
  return new Promise((resolve, reject) => {
    const truthy = requiredKeysAreTruthy(req.params, [idFieldName]);
    if (!truthy.success) {
      res.status(400).send(truthy.error);
      reject(truthy.error);
    }

    else {
      const id = req.params[idFieldName];
      const result = getUpdateFieldsFromRequestBody(req.body, fillableFields, fieldCleaningFunction);
      if (!result.success) {
        res.status(400).send(result.error);
        reject(result.error);
        return;
      }

      const updateObj = result.data;
      getDB().update(tableName, id, updateObj)
        .then(results => {
          if (onlyReturnId && afterInsertCallback) {
            afterInsertCallback(id);
            resolve();
          } else {
            getDB().query(`SELECT * FROM ?? WHERE id = ?`, [tableName, id], customConnection)
              .then(data => {
                if (afterInsertCallback) {
                  afterInsertCallback(data);
                } else {
                  res.json(data);
                }
                resolve();
              }).catch(e => {
                next(e);
                reject(e);
              });
          }
        })
        .catch(error => {
          if (error === "NOT_FOUND") {
            res.status(404).send(`Record with ID ${id} not found`);
          } else if (error === "NO_VALUES") {
            res.status(400).send(`No non-empty update values were found`);
          } else
            next(error);
          reject(error);
        });
    }
  });
}

const commonInsert = (tableName, requiredOnInsertFields, fillableFields, req, res, next, afterInsertCallback = null, fieldCleaningFunction = null, onlyReturnId = false, customConnection = null) => {
  return new Promise((resolve, reject) => {
    const truthy = requiredKeysAreTruthy(req.body, requiredOnInsertFields);
    if (!truthy.success) {
      res.status(400).send(truthy.error);
      reject(truthy.error);
    }

    else {
      const result = getUpdateFieldsFromRequestBody(req.body, requiredOnInsertFields.concat(fillableFields), fieldCleaningFunction);
      if (!result.success) {
        next(result.error);
        reject(result.error);
        return;
      }

      const updateObj = result.data;
      getDB().insert(tableName, updateObj)
        .then(results => {
          if (onlyReturnId && afterInsertCallback) {
            afterInsertCallback(results.insertId);
            resolve();
          } else {
            getDB().query(`SELECT * FROM ?? WHERE id = ?`, [tableName, results.insertId], customConnection)
              .then(data => {
                if (afterInsertCallback) {
                  afterInsertCallback(data);
                } else {
                  res.json(data);
                }
                resolve();
              }).catch(e => {
                next(e);
                reject(e);
              });
          }
        })
        .catch(err => {
          next(err);
          reject(err);
        });
    }
  });
};

const commonDelete = (tableName, idFieldName, req, res, next) => {
  return new Promise((resolve, reject) => {
    const truthy = requiredKeysAreTruthy(req.params, [idFieldName]);
    if (!truthy.success) {
      res.status(400).send(truthy.error);
      reject(truthy.error);
    }

    else {
      const id = req.params[idFieldName];
      getDB().destroy(tableName, id)
        .then(result => {
          res.json({ success: true });
          resolve();
        })
        .catch(err => {
          if (err === "NOT_FOUND") {
            res.status(404).send(`Record with ID ${id} not found`);
          } else
            next(err);
          reject(err);
        });
    }
  });
};

const commonGet = (tableName, req, res, next) => {
  return new Promise((resolve, reject) => {
    getDB().query('SELECT * FROM ?? WHERE deleted_at IS NULL', [tableName])
      .then(result => {
        res.send(result);
        resolve(result);
      })
      .catch(err => {
        next(err);
        reject(err);
      });
  });
};

const commonShow = (tableName, idFieldName, req, res, next) => {
  return new Promise((resolve, reject) => {
    const truthy = requiredKeysAreTruthy(req.params, [idFieldName]);
    if (!truthy.success) {
      res.status(400).send(truthy.error);
      reject(truthy.error);
    }

    else {
      getDB().query('SELECT * FROM ?? WHERE id = ?', [tableName, req.params[idFieldName]])
        .then(result => {
          res.send(result);
          resolve(result);
        })
        .catch(err => {
          next(err);
          reject(err);
        });
    }
  });
};

// formId is only needed when getting values for table fields
const fillInFieldExtrasAndCleanFields = (fields, containsUserData = false, formId = null) => {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(fields) || !fields.length) {
      resolve(fields);
      return;
    }

    const allFields = {};
    const autocompleteFieldIds = [];
    const tableFieldIds = [];
    const getRowFunc = containsUserData ? row => formInputFields.cleanFormFieldForOutput(row) : row => row;
    for (let i = 0; i < fields.length; i++) {
      const row = fields[i];
      if (row.hasAutocompleteOptions) {
        row.autocompleteOptions = [];
        autocompleteFieldIds.push(row.id);
      } else if (row.hasTableColumns) {
        row.columns = [];
        tableFieldIds.push(row.id);
      }
      delete row.hasAutocompleteOptions;
      delete row.hasTableColumns;
      delete row.formStatus;
      delete row.formStatusId;
      delete row.formStatusName;
      allFields[row.id] = getRowFunc(row);
    }

    if (autocompleteFieldIds.length) {
      sql = `SELECT
        CONCAT('"', REPLACE(optKey, '"', '\"'), '":"', REPLACE(value, '"', '\"'), '"') AS jsonFormat,
        fieldId
      FROM autocompleteOptions ao
      WHERE fieldId IN (${'?,'.repeat(autocompleteFieldIds.length - 1)}?) AND deleted_at IS NULL
      ORDER BY fieldId`;
      let result;
      try {
        result = await getDB().query(sql, autocompleteFieldIds);
      } catch (e) {
        reject(e);
        return;
      }

      let { jsonFormat, fieldId } = result[0];
      if (result.length === 1) {
        allFields[fieldId].autocompleteOptions = JSON.parse(`{${jsonFormat}}`);
      } else {
        allFields[fieldId].autocompleteOptions.push(jsonFormat);

        for (let i = 1; i < result.length; i++) {
          const { jsonFormat, fieldId } = result[i];
          const lastFieldId = result[i - 1].fieldId;
          allFields[fieldId].autocompleteOptions.push(jsonFormat);

          if (lastFieldId !== fieldId) {
            allFields[lastFieldId].autocompleteOptions = JSON.parse(`{${allFields[lastFieldId].autocompleteOptions.join(',')}}`);
          } else if (i + 1 === result.length) {
            allFields[fieldId].autocompleteOptions = JSON.parse(`{${allFields[fieldId].autocompleteOptions.join(',')}}`);
          }
        }
      }
    }

    if (tableFieldIds.length) {
      sql = `SELECT
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
          t.name AS typeName,
          f.forTableFieldId
          ${containsUserData && formId ? `, GROUP_CONCAT('"', REPLACE(REPLACE(ftrf.rowId, ':', '\\:'), '"', '\\\"'), '":"', REPLACE(REPLACE(REPLACE(ftrf.value, ':', '\\:'), ';', '\\;'), '"', '\\\"'), '"') AS rowValues ` : ''}
        FROM field f
        JOIN fieldType t ON (f.typeId = t.id)
        ${containsUserData && formId ? `LEFT JOIN fieldToRequestForm ftrf ON (ftrf.requestFormId = ? AND ftrf.fieldId = f.id AND ftrf.deleted_at IS NULL)` : ''}
        WHERE f.forTableFieldId IN (${'?,'.repeat(tableFieldIds.length - 1)}?)
          AND f.deleted_at IS NULL
        GROUP BY f.id
        ORDER BY f.sortOrder`;
      let result;
      try {
        const params = containsUserData && formId ? [formId, ...tableFieldIds] : tableFieldIds;
        result = await getDB().query(sql, params);
      } catch (e) {
        reject(e);
        return;
      }

      result = specialFormTypeFields.cleanFieldsForOutput(result);
      for (let i = 0; i < result.length; i++) {
        const f = result[i];
        if (containsUserData && formId && f.rowValues) {
          const rowValues = f.rowValues? JSON.parse(`{${f.rowValues}}`) : {};
          const rowIds = Object.keys(rowValues);
          for (let j = 0; j < rowIds.length; j++) {
            const key = rowIds[j];
            const value = rowValues[key];
            rowValues[key] = formInputFields.cleanFormFieldForOutput({...f, value}).value || null;
          }
          f.rows = rowValues;
        }
        delete f.rowValues;
        allFields[f.forTableFieldId].columns.push(f);
      }
    }

    resolve(specialFormTypeFields.cleanFieldsForOutput(Object.values(allFields)));
  });
};

module.exports = {
  cleanUniqueKey,
  requiredKeysAreTruthy,
  getNowUTC,
  getUpdateFieldsFromRequestBody,
  commonUpdate,
  commonInsert,
  commonDelete,
  commonGet,
  commonShow,
  fillInFieldExtrasAndCleanFields,

  ...specialFormTypeFields,
  ...formInputFields
};
