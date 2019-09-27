const db = require('../util/db');
jest.mock('../util/db');

const specialFormTypeFields = require('../util/specialFormTypeFields');
jest.mock('../util/specialFormTypeFields');

const inputCleaningFunctions = require('../util/inputCleaningFunctions');
jest.mock('../util/inputCleaningFunctions');

const formInputFields = require('../util/formInputFields');
jest.mock('../util/formInputFields');

const moment = require('moment');
jest.mock('moment');
moment.mockImplementation(() => {
  return {
    format: jest.fn()
      .mockImplementation(() => "2019-01-01")
      .mockName("moment.format"),
    add: jest.fn()
      .mockImplementation(() => {
        return {
          format: jest.fn()
            .mockImplementation(() => "2019-01-05")
            .mockName("moment.add.format")
        };
      })
      .mockName("moment.add")
  };
});

const util = require('../util/util');

// ---- cleanUniqueKey ----
describe('cleanUniqueKey', () => {
  test('return correct value when given non-string input', () => {
    expect(util.cleanUniqueKey(null)).toStrictEqual(null);
    expect(util.cleanUniqueKey(3)).toStrictEqual(3);
    expect(util.cleanUniqueKey(0)).toStrictEqual(0);
    expect(util.cleanUniqueKey(true)).toStrictEqual(true);
    expect(util.cleanUniqueKey(false)).toStrictEqual(false);
    expect(util.cleanUniqueKey(undefined)).toStrictEqual(undefined);
  });

  test('return correct value when given string input', () => {
    expect(util.cleanUniqueKey('')).toStrictEqual('');
    expect(util.cleanUniqueKey('ab cd')).toStrictEqual('AB_CD');
    expect(util.cleanUniqueKey('ab')).toStrictEqual('AB');
    expect(util.cleanUniqueKey('ab   \t  \n cd')).toStrictEqual('AB_CD');
  });
});


// ---- requiredKeysAreTruthy ----
describe('requiredKeysAreTruthy', () => {
  test('return correct value when given falsy parameters', () => {
    const errorObj = { success: false, error: "No parameters found" };
    expect(util.requiredKeysAreTruthy('', [])).toStrictEqual(errorObj);
    expect(util.requiredKeysAreTruthy(null, [])).toStrictEqual(errorObj);
    expect(util.requiredKeysAreTruthy(undefined, [])).toStrictEqual(errorObj);
    expect(util.requiredKeysAreTruthy(0, [])).toStrictEqual(errorObj);
  });

  test('return correct value when given empty required keys list', () => {
    expect(util.requiredKeysAreTruthy({ abc: 1 }, [])).toStrictEqual({ success: true });
  });

  test('return correct value when given parameters that do not contain all required keys', () => {
    const errorObj = { success: false, error: `Abc not specified` };
    expect(util.requiredKeysAreTruthy({}, ['abc'])).toStrictEqual(errorObj);
    expect(util.requiredKeysAreTruthy({ def: 1, ghi: 4 }, ['def', 'abc'])).toStrictEqual(errorObj);
  });

  test('return correct value when given valid input', () => {
    const successObj = { success: true };
    expect(util.requiredKeysAreTruthy({ abc: 1 }, ['abc'])).toStrictEqual(successObj);
    expect(util.requiredKeysAreTruthy({ abc: 1 }, [])).toStrictEqual(successObj);
    expect(util.requiredKeysAreTruthy({ def: 1, ghi: 4, abc: 55 }, ['def', 'abc'])).toStrictEqual(successObj);
  });
});


// ---- getNowUTC ----
test('getNowUTC to return correct value', () => {
  expect(util.getNowUTC()).toStrictEqual(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
});


// ---- getUpdateFieldsFromRequestBody ----
describe('getUpdateFieldsFromRequestBody', () => {
  test('return expected fields when given valid input', () => {
    expect(util.getUpdateFieldsFromRequestBody({ a: 0, b: 2, c: 3 }, ['a', 'b'])).toStrictEqual({ success: true, data: { a: 0, b: 2 } });
    expect(util.getUpdateFieldsFromRequestBody({ a: '', b: 1, c: 3 }, ['a', 'b'])).toStrictEqual({ success: true, data: { a: '', b: 1 } });
    expect(util.getUpdateFieldsFromRequestBody({ a: null, b: 1 }, ['a'])).toStrictEqual({ success: true, data: { a: null } });

    // fieldCleaningFunction
    expect(util.getUpdateFieldsFromRequestBody({ a: 2, b: 1 }, ['a'], f => ['hello'])).toStrictEqual({ success: true, data: 'hello' });
  });

  test('return error object when not given valid input', () => {
    expect(util.getUpdateFieldsFromRequestBody({ a: 0, b: 2, c: 3 }, [])).toStrictEqual({ success: false, error: "No non-empty update fields" });
  });
});


// ---- fillInFieldExtrasAndCleanFields ----
describe('fillInFieldExtrasAndCleanFields', () => {
  let originalDbQuery;

  beforeEach(() => {
    originalDbQuery = db.query;
  });

  afterEach(() => {
    if (originalDbQuery) {
      db.query = originalDbQuery;
      originalDbQuery = null;
    }
  });

  test('return expected results when given valid input', async () => {
    const field1 = { id: 1, categoryId: 1, hasAutocompleteOptions: 1, formStatusId: 1, typeName: 'autocomplete' };
    const field2 = { id: 2, categoryId: 1, hasAutocompleteOptions: 1, formStatusId: 1, typeName: 'autocomplete' };
    const field3 = { id: 3, categoryId: 1, hasAutocompleteOptions: 0, formStatusId: 1, typeName: 'textbox' };
    const field4 = { id: 4, categoryId: 1, formStatusId: 1, typeName: 'checkbox', options: ['a1', 'a2', 'a3', 'b1', 'b2'] };

    const field1AutocompleteResult1 = { fieldId: 1, jsonFormat: '"key1":"value1"' };
    const field1AutocompleteResult2 = { fieldId: 1, jsonFormat: '"key2":"value2"' };
    const field2AutocompleteResult1 = { fieldId: 2, jsonFormat: '"key1":"value1"' };
    const field2AutocompleteResult2 = { fieldId: 2, jsonFormat: '"key2":"value2"' };
    const field2AutocompleteResult3 = { fieldId: 2, jsonFormat: '"key3":"value3"' };

    db.query = jest.fn()
      .mockReturnValue([field1AutocompleteResult1, field1AutocompleteResult2, field2AutocompleteResult1, field2AutocompleteResult2, field2AutocompleteResult3]);

    let result = await util.fillInFieldExtrasAndCleanFields([field1, field2, field3, field4]);
    expect(result).toStrictEqual([
      { ...field1, autocompleteOptions: { key1: 'value1', key2: 'value2' } },
      { ...field2, autocompleteOptions: { key1: 'value1', key2: 'value2', key3: 'value3' } },
      field3,
      field4
    ]);

    // containsUserData = true
    field1.value = 'value2';
    field2.value = 'value3';
    field3.value = 'value';
    result = await util.fillInFieldExtrasAndCleanFields([field1, field2, field3, { ...field4, value: 'a1;b2' }], true);
    delete field1.typeName;
    delete field2.typeName;
    delete field3.typeName;
    delete field4.typeName;
    expect(result).toStrictEqual([
      { ...field1, autocompleteOptions: { key1: 'value1', key2: 'value2' } },
      { ...field2, autocompleteOptions: { key1: 'value1', key2: 'value2', key3: 'value3' } },
      field3,
      { ...field4, value: ['a1', 'b2'] }
    ]);
  });

  test('return passed in parameter when given invalid input', async () => {
    let result = await util.fillInFieldExtrasAndCleanFields([]);
    expect(result).toStrictEqual([]);

    result = await util.fillInFieldExtrasAndCleanFields(null);
    expect(result).toStrictEqual(null);

    result = await util.fillInFieldExtrasAndCleanFields(0);
    expect(result).toStrictEqual(0);

    result = await util.fillInFieldExtrasAndCleanFields(2);
    expect(result).toStrictEqual(2);

    result = await util.fillInFieldExtrasAndCleanFields('hello');
    expect(result).toStrictEqual('hello');

    result = await util.fillInFieldExtrasAndCleanFields({});
    expect(result).toStrictEqual({});
  });
});


describe('Common Database Functions', () => {
  const tableName = 'tableName';
  const fillableFields = ['field1', 'field2'];
  const idFieldName = 'idField';
  const req = {
    params: { [idFieldName]: 1 },
    body: {
      field1: 'update1',
      field2: 'update2'
    }
  };
  let res, status, send, next, originalDbQuery, originalDbUpdate, originalDbDestroy;

  beforeEach(() => {
    originalDbQuery = db.query;
    originalDbUpdate = db.update;
    originalDbDestroy = db.destroy;
    send = jest.fn();
    status = jest.fn()
      .mockImplementation(() => {
        return { send };
      });
    json = jest.fn();
    res = {
      send,
      status,
      json
    };
    next = jest.fn();
  });

  afterEach(() => {
    if (originalDbQuery) {
      db.query = originalDbQuery;
      originalDbQuery = null;
    }
    if (originalDbUpdate) {
      db.update = originalDbUpdate;
      originalDbUpdate = null;
    }
    if (originalDbDestroy) {
      db.destroy = originalDbDestroy;
      originalDbDestroy = null;
    }
  });

  // ---- commonUpdate ----
  describe('commonUpdate', () => {
    test('send error message when not given an ID value', async () => {
      try {
        await util.commonUpdate(tableName, fillableFields, idFieldName, { params: { aaaa: 'invalid' } }, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(0);
        expect(status.mock.calls.length).toBe(1);
        expect(send.mock.calls.length).toBe(1);
        expect(json.mock.calls.length).toBe(0);
        expect(status.mock.calls[0][0]).toBe(400);
        expect(send.mock.calls[0][0]).toStrictEqual("IdField not specified");
        expect(e).toStrictEqual("IdField not specified");
      }
    });

    test('send error when not given any fillable field values', async () => {
      const req = {
        params: { [idFieldName]: 1 },
        body: {
          invalidField1: 'update1',
          invalidField2: 'update2'
        }
      };
      try {
        await util.commonUpdate(tableName, fillableFields, idFieldName, req, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(0);
        expect(status.mock.calls.length).toBe(1);
        expect(send.mock.calls.length).toBe(1);
        expect(json.mock.calls.length).toBe(0);
        expect(status.mock.calls[0][0]).toBe(400);
        expect(send.mock.calls[0][0]).toStrictEqual("No non-empty update fields");
        expect(e).toStrictEqual("No non-empty update fields");
      }
    });

    test('send error when query can\'t find passed ID', async () => {
      db.update = jest.fn()
        .mockImplementation(() => {
          return new Promise((resolve, reject) => {
            reject("NOT_FOUND");
          });
        });

      try {
        await util.commonUpdate(tableName, fillableFields, idFieldName, req, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(0);
        expect(status.mock.calls.length).toBe(1);
        expect(send.mock.calls.length).toBe(1);
        expect(json.mock.calls.length).toBe(0);
        expect(status.mock.calls[0][0]).toBe(404);
        expect(send.mock.calls[0][0]).toStrictEqual("Record with ID 1 not found");
        expect(e).toStrictEqual("NOT_FOUND");
      }
    });

    test('send expected result when all is well', async () => {
      await util.commonUpdate(tableName, fillableFields, idFieldName, req, res, next);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(0);
      expect(json.mock.calls.length).toBe(1);
      expect(json.mock.calls[0][0]).toStrictEqual([{ "data": "data" }]);
    });

    test('call callback', async () => {
      const afterInsertCallback = jest.fn();
      await util.commonUpdate(tableName, fillableFields, idFieldName, req, res, next, afterInsertCallback);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(0);
      expect(json.mock.calls.length).toBe(0);
      expect(afterInsertCallback.mock.calls.length).toBe(1);
      expect(afterInsertCallback.mock.calls[0][0]).toStrictEqual([{ "data": "data" }]);
    });

    test('call callback with only ID', async () => {
      const afterInsertCallback = jest.fn();
      const onlyReturnId = true;
      await util.commonUpdate(tableName, fillableFields, idFieldName, req, res, next, afterInsertCallback, null, onlyReturnId);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(0);
      expect(json.mock.calls.length).toBe(0);
      expect(afterInsertCallback.mock.calls.length).toBe(1);
      expect(afterInsertCallback.mock.calls[0][0]).toStrictEqual(1);
    });
  });


  // ---- commonInsert ----
  describe('commonInsert', () => {
    const requiredOnInsertFields = ['field1'];

    test('send error message when not given required fields', async () => {
      try {
        await util.commonInsert(tableName, requiredOnInsertFields, fillableFields, { params: { aaaa: 'invalid' } }, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(0);
        expect(status.mock.calls.length).toBe(1);
        expect(send.mock.calls.length).toBe(1);
        expect(json.mock.calls.length).toBe(0);
        expect(status.mock.calls[0][0]).toBe(400);
        expect(send.mock.calls[0][0]).toStrictEqual("No parameters found");
        expect(e).toStrictEqual("No parameters found");
      }
    });

    test('send expected result when all is well', async () => {
      await util.commonInsert(tableName, requiredOnInsertFields, fillableFields, req, res, next);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(0);
      expect(json.mock.calls.length).toBe(1);
      expect(json.mock.calls[0][0]).toStrictEqual([{ "data": "data" }]);
    });

    test('call callback', async () => {
      const afterInsertCallback = jest.fn();
      await util.commonInsert(tableName, requiredOnInsertFields, fillableFields, req, res, next, afterInsertCallback);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(0);
      expect(json.mock.calls.length).toBe(0);
      expect(afterInsertCallback.mock.calls.length).toBe(1);
      expect(afterInsertCallback.mock.calls[0][0]).toStrictEqual([{ "data": "data" }]);
    });

    test('call callback with only ID', async () => {
      const afterInsertCallback = jest.fn();
      const onlyReturnId = true;
      await util.commonInsert(tableName, requiredOnInsertFields, fillableFields, req, res, next, afterInsertCallback, null, onlyReturnId);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(0);
      expect(json.mock.calls.length).toBe(0);
      expect(afterInsertCallback.mock.calls.length).toBe(1);
      expect(afterInsertCallback.mock.calls[0][0]).toStrictEqual(1);
    });

    /*
const commonInsert = (tableName, requiredOnInsertFields, fillableFields, req, res, next, afterInsertCallback = null, fieldCleaningFunction = null, onlyReturnId = false, customConnection = null) => {
  // ...

    const updateObj = result.data;
    getDB().insert(tableName, updateObj)
      .then(results => {
        if (onlyReturnId && afterInsertCallback) {
          afterInsertCallback(results.insertId);
        } else {
          getDB().query(`SELECT * FROM ?? WHERE id = ?`, [tableName, results.insertId], customConnection)
            .then(data => {
              if (afterInsertCallback) {
                afterInsertCallback(data);
              } else {
                res.json(data);
              }
            }).catch(next);
        }
      })
      .catch(err => {
        next(err);
      });
  }
};
    */
  });


  // ---- commonDelete ----
  describe('commonDelete', () => {
    test('send error message when not given an ID value', async () => {
      try {
        await util.commonDelete(tableName, idFieldName, { params: { aaaa: 'invalid' } }, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(0);
        expect(status.mock.calls.length).toBe(1);
        expect(send.mock.calls.length).toBe(1);
        expect(json.mock.calls.length).toBe(0);
        expect(status.mock.calls[0][0]).toBe(400);
        expect(send.mock.calls[0][0]).toStrictEqual("IdField not specified");
        expect(e).toStrictEqual("IdField not specified");
      }
    });

    test('send error message when ID is not found', async () => {
      db.destroy = jest.fn()
        .mockImplementation(() => {
          return new Promise((resolve, reject) => {
            reject("NOT_FOUND");
          });
        });
      try {
        await util.commonDelete(tableName, idFieldName, req, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(0);
        expect(status.mock.calls.length).toBe(1);
        expect(send.mock.calls.length).toBe(1);
        expect(json.mock.calls.length).toBe(0);
        expect(status.mock.calls[0][0]).toBe(404);
        expect(send.mock.calls[0][0]).toStrictEqual("Record with ID 1 not found");
        expect(e).toStrictEqual("NOT_FOUND");
      }
    });

    test('send error message when an error is encountered', async () => {
      db.destroy = jest.fn()
        .mockImplementation(() => {
          return new Promise((resolve, reject) => {
            reject("DB Error");
          });
        });
      try {
        await util.commonDelete(tableName, idFieldName, req, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(1);
        expect(status.mock.calls.length).toBe(0);
        expect(send.mock.calls.length).toBe(0);
        expect(json.mock.calls.length).toBe(0);
        expect(next.mock.calls[0][0]).toStrictEqual("DB Error");
      }
    });

    test('send success when all is well', async () => {
      await util.commonDelete(tableName, idFieldName, req, res, next);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(0);
      expect(json.mock.calls.length).toBe(1);
      expect(json.mock.calls[0][0]).toStrictEqual({ success: true });
    });
  });


  // ---- commonGet ----
  describe('commonGet', () => {
    test('send error message when an error is encountered', async () => {
      db.query = jest.fn()
        .mockImplementation(() => {
          return new Promise((resolve, reject) => {
            reject("DB Error");
          });
        });
      try {
        await util.commonGet(tableName, req, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(1);
        expect(status.mock.calls.length).toBe(0);
        expect(send.mock.calls.length).toBe(0);
        expect(json.mock.calls.length).toBe(0);
        expect(next.mock.calls[0][0]).toStrictEqual("DB Error");
        expect(e).toStrictEqual("DB Error");
      }
    });

    test('send result when all is well', async () => {
      await util.commonGet(tableName, req, res, next);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(1);
      expect(json.mock.calls.length).toBe(0);
      expect(send.mock.calls[0][0]).toStrictEqual([{ "data": "data" }]);
    });
  });


  // ---- commonShow ----
  describe('commonShow', () => {
    test('send error message when ID field is not given', async () => {
      try {
        await util.commonShow(tableName, idFieldName, { params: { asdfasdfadfg: 1 } }, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(0);
        expect(status.mock.calls.length).toBe(1);
        expect(send.mock.calls.length).toBe(1);
        expect(json.mock.calls.length).toBe(0);
        expect(status.mock.calls[0][0]).toBe(400);
        expect(send.mock.calls[0][0]).toStrictEqual("IdField not specified");
        expect(e).toStrictEqual("IdField not specified");
      }
    });

    test('send error message when an error is encountered', async () => {
      db.query = jest.fn()
        .mockImplementation(() => {
          return new Promise((resolve, reject) => {
            reject("DB Error");
          });
        });
      try {
        await util.commonShow(tableName, idFieldName, req, res, next);
      } catch (e) {
        expect(next.mock.calls.length).toBe(1);
        expect(status.mock.calls.length).toBe(0);
        expect(send.mock.calls.length).toBe(0);
        expect(json.mock.calls.length).toBe(0);
        expect(next.mock.calls[0][0]).toStrictEqual("DB Error");
        expect(e).toStrictEqual("DB Error");
      }
    });

    test('send results when all is well', async () => {
      await util.commonShow(tableName, idFieldName, req, res, next);
      expect(next.mock.calls.length).toBe(0);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(1);
      expect(json.mock.calls.length).toBe(0);
      expect(send.mock.calls[0][0]).toStrictEqual([{ data: "data" }]);
    });
  });
});
