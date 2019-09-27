const dbUtil = require('../util/db');

exports.up = db => {
  return db.query(`CREATE TABLE requestFormStatus (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    canBeDeleted INT NOT NULL DEFAULT 1,
    ${dbUtil.getTimestampFields()},
    PRIMARY KEY (id),
    UNIQUE INDEX requestFormStatus_name_unique_idx (name ASC)
  )`);
};

exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS requestFormStatus`);
};
