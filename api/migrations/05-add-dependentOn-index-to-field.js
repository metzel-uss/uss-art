const dbUtil = require('../util/db');

exports.up = db => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.query(`ALTER TABLE field
        ADD INDEX field_dependentOn_fk_idx (dependentOnId ASC)`);
      await db.query(`ALTER TABLE field
        ADD CONSTRAINT field_dependentOn_fk
          FOREIGN KEY (dependentOnId)
          REFERENCES field (id)
          ON DELETE SET NULL
          ON UPDATE NO ACTION`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exports.down = db => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.query(`ALTER TABLE field 
        DROP FOREIGN KEY field_dependentOn_fk`);
      await db.query(`ALTER TABLE field
        DROP INDEX field_dependentOn_fk_idx`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
