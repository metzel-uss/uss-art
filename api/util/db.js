const mysql = require('mysql');
const getConfig = () => {
  const getLocalhostConfig = () => {
    return {
      host: process.env.LOCAL_DB_HOST,
      user: process.env.LOCAL_DB_USERNAME,
      password: process.env.LOCAL_DB_PASSWORD,
      database: process.env.LOCAL_DB_NAME,
      port: 3306,
      ssl: false
    };
  };
  const getDevConfig = () => {
    return {
      host: process.env.DEV_DB_HOST,
      user: process.env.DEV_DB_USERNAME,
      password: process.env.DEV_DB_PASSWORD,
      database: process.env.DEV_DB_NAME,
      port: 3306,
      ssl: true
    };
  };
  const getQAConfig = () => { /* TODO */ };
  const getProdConfig = () => { /* TODO */ };

  switch ((process.env.ENVIRONMENT || '').toLowerCase()) {
    case 'localhost':
      return getLocalhostConfig();
    case 'development':
      return getDevConfig();
    case 'qa':
      return getQAConfig();
    case 'production':
      return getProdConfig();
    default:
      return getLocalhostConfig();
  }
};

const config = getConfig();
const timeout = process.env.SQL_TIMEOUT || 40000;

const getConnection = (customConfig = config) => {

  var config =
  {
    host: 'd5dev02iturtsql01.mysql.database.azure.com',
    user: 'p5dev02iturt01.svc@d5dev02iturtsql01',
    password: 'bZNWA1gCQszKYLKdgolzQBv1FnuK9CDikKeF0nf4P5hmtNoRYnfkJW6agpss',
    database: 'art',
    port: 3306,
    ssl: true
  };

  return new mysql.createConnection(config);
};



const endConnection = conn => {
  return new Promise((resolve, reject) => {
    if (conn) {
      try {
        conn.end((err) => {
          if (err) reject(err);
          else resolve();
        });
      } catch (e) {
        reject(e);
      }
    } else
      resolve();
  });
};

const getTimestampFields = () => {
  return `created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    deleted_at TIMESTAMP NULL`;
};

const query = (query, params = null, customConnection = null) => {
  return new Promise((resolve, reject) => {
    const conn = customConnection ? customConnection : getConnection();
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
        endConnection(conn);
      });
  });
};

const insert = (tableName, valueObj, customConnection = null) => {
  return new Promise((resolve, reject) => {
    if (!tableName || !valueObj) {
      reject("Table name or value object falsy");
      return;
    }

    if (!Array.isArray(valueObj)) {
      valueObj = [valueObj];
    } else if (Array.isArray(valueObj) && valueObj.length === 0) {
      reject("No values found");
      return;
    }

    const keys = Object.keys(valueObj[0]);
    if (keys.length === 0) {
      reject("No value keys found");
      return;
    }

    let valueParams = [];
    const insertSql = [];
    const insertSqlString = `(${'?,'.repeat(keys.length - 1)}?)`;
    for (let i = 0; i < valueObj.length; i++) {
      valueParams = valueParams.concat(Object.values(valueObj[i]));
      insertSql.push(insertSqlString);
    }

    const sql = `INSERT INTO ?? (${'??,'.repeat(keys.length - 1)}??) VALUES ${insertSql.join(', ')}`;
    const params = [tableName, ...keys, ...valueParams];
    query(sql, params, customConnection)
      .then(results => {
        if (results.affectedRows === 0) {
          reject("NOT_FOUND");
        } else {
          resolve(results);
        }
      }).catch(e => {
        reject(e);
      });
  });
};

const update = (tableName, id, valueObj, customConnection = null) => {
  return new Promise((resolve, reject) => {
    if (!tableName || !valueObj) {
      reject("Table name or value object falsy");
      return;
    }
    const keys = Object.keys(valueObj);
    if (keys.length === 0) {
      reject("NO_VALUES");
      return;
    }

    const questionMarkArray = [];
    const params = [tableName];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      questionMarkArray.push('?? = ?');
      params.push(k);
      params.push(valueObj[k]);
    }
    params.push(id);

    const sql = `UPDATE ?? SET ${questionMarkArray.join(', ')} WHERE id = ?`;
    query(sql, params, customConnection)
      .then(results => {
        if (results.affectedRows === 0) {
          reject("NOT_FOUND");
        } else {
          resolve(results);
        }
      }).catch(e => {
        reject(e);
      });
  });
};

const multiUpdate = (tableName, updates, options = {}, customConnection = null) => {
  return new Promise((resolve, reject) => {
    if (!tableName || !updates) {
      reject("Table name or value object falsy");
      return;
    }

    if (updates.length === 0) {
      reject("NO_VALUES");
      return;
    }

    const { whereFields } = options;
    const processUpdate = update => {
      return new Promise((resolve, reject) => {
        const questionMarkArray = [];
        const params = [tableName];
        const keys = Object.keys(update);
        const wheres = [];
        const whereParams = [];
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (!whereFields.includes(k)) {
            questionMarkArray.push('?? = ?');
            params.push(k);
            params.push(update[k]);
          } else {
            wheres.push('?? = ?');
            whereParams.push(k);
            whereParams.push(update[k]);
          }
        }

        const sql = `UPDATE ?? SET ${questionMarkArray.join(', ')} WHERE ${wheres.join(' AND ')}`;
        query(sql, params.concat(whereParams), customConnection)
          .then(results => {
            if (results.affectedRows === 0) {
              reject("NOT_FOUND");
            } else {
              resolve(results);
            }
          }).catch(e => {
            reject(e);
          });
      });
    };

    Promise.all(updates.map(u => processUpdate(u)))
      .then(r => resolve(r)).catch(e => reject(e));
  });
};

const destroy = (tableName, id, customConnection = null) => {
  return new Promise((resolve, reject) => {
    if (!tableName || !id) {
      reject("Table name or ID falsy");
      return;
    }
    const sql = `UPDATE ?? SET deleted_at = NOW() WHERE id = ?`;
    const params = [tableName, id];
    query(sql, params, customConnection)
      .then(results => {
        if (results.affectedRows === 0) {
          reject("NOT_FOUND");
        } else {
          resolve(results);
        }
      }).catch(e => {
        reject(e);
      });
  });
};

// Only usable in dev.  Deletes all data in a table.
const destroyAll = (tableName) => {
  return new Promise((resolve, reject) => {
    const env = (process.env.ENVIRONMENT || '').toLowerCase();
    if (env === 'development' || env === 'localhost') {
      const sql = `DELETE FROM ??`;
      const params = [tableName];
      query(sql, params)
        .then(results => {
          resolve(results);
        }).catch(e => {
          reject(e);
        });
    } else {
      reject("This command only runs in a development environment");
      return;
    }
  });
};

module.exports = {
  query,
  getConnection,
  endConnection,
  getTimestampFields,
  insert,
  update,
  multiUpdate,
  destroy,
  destroyAll
};
