const mysql = require('mysql');
jest.mock('mysql');

// const db = require('../util/db');
// jest.mock('../util/db');

const db = require('../util/db');

describe('util/db', () => {
  const returnData = [{ data: 'data1' }, { data: 'data2' }];
  const initialize = ({ endError = null, queryError = null, queryResults = returnData }) => {
    console.log("initialize");
    console.log("queryError",queryError);
    mysql.createConnection = jest.fn()
      .mockImplementation(() => {
        return {
          end: jest.fn()
            .mockImplementation(callback => {
              callback(endError);
            }).mockName("conn.end"),
          query: jest.fn()
            .mockImplementation((options, callback) => {
              callback(queryError, queryResults);
            })
            .mockName("conn.query")
        };
      });
  };

  afterEach(() => {
    delete mysql.createConnection;
  });

  // ---- query ----
  describe('query', () => {
    const sql = 'SELECT * FROM test';
    let originalConsoleError;

    beforeEach(() => {
      originalConsoleError = console.error;
      console.error = jest.fn();
    });
    afterEach(() => {
      if (originalConsoleError) {
        console.error = originalConsoleError;
        originalConsoleError = null;
      }
    });

    test('return error if error is encountered', async () => {
      initialize({ queryError: "DB Error" });
      try {
        await db.query(sql);
      } catch (e) {
        expect(console.error.mock.calls.length).toBe(2);
        expect(console.error.mock.calls[0][0]).toBe("error occurred: ");
        expect(console.error.mock.calls[1][0]).toBe("DB Error");
        expect(e).toStrictEqual("DB Error");
      }
    });

    test('return data if all is well', async () => {
      console.log("before initialize");
      initialize({});
      console.log("after initialize");
      console.log("db.query:",db.query);
      mysql.createConnection().query({}, (err, res) => {
        console.log("test err", err);
        console.log("test res", res);
      });
      let result;
      try {
        result = await db.query(sql);
      } catch (e) {
        expect(e).toStrictEqual(undefined);
      }
      console.log("result:",result);
      expect("3").toBe(0);
      // expect(console.error.mock.calls.length).toBe(0);
      // expect(result).toStrictEqual(returnData);
    });

    /*
    const query = (query, params = null, customConnection = null) => {
      return new Promise((resolve, reject) => {
        const conn = customConnection || getConnection();
        conn.query({
          sql: query,
          values: params,
          timeout
        },
          (err, results, fields) => {
            if (err) {
              console.error("error occurred: ");
              console.error(err);
              reject(err);
            } else if (results) {
              resolve(results);
            }
          });
      });
    };
    */
  });







  // ---- getConnection ----
  // ---- endConnection ----
  // ---- getTimestampFields ----
  // ---- insert ----
  // ---- update ----
  // ---- multiUpdate ----
  // ---- destroy ----
  // ---- destroyAll ----

});
