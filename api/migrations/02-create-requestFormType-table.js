const dbUtil = require('../util/db');

exports.up = db => {
  return db.query(`CREATE TABLE requestFormType (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    sortOrder INT NOT NULL,
    ${dbUtil.getTimestampFields()},
    PRIMARY KEY (id),
    UNIQUE INDEX name_UNIQUE (name ASC),
    UNIQUE INDEX sortOrder_UNIQUE (sortOrder ASC)
  )`);
};

exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS requestFormType`);
};
