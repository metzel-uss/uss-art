const dbUtil = require('../util/db');

exports.up = db => {
  return db.query(`CREATE TABLE fieldCategory (
    id INT NOT NULL AUTO_INCREMENT,
    formTypeId INT NOT NULL,
    name VARCHAR(80) NOT NULL,
    sortOrder INT NOT NULL,
    required INT NOT NULL DEFAULT 0,
    ${dbUtil.getTimestampFields()},
    PRIMARY KEY (id),
    INDEX fieldCategory_requestFormType_fk_idx (formTypeId ASC),
    -- UNIQUE INDEX name_formTypeId_UNIQUE (name ASC, formTypeId ASC),
    -- UNIQUE INDEX formTypeId_sortOrder_UNIQUE (formTypeId ASC, sortOrder ASC),
    CONSTRAINT fieldCategory_requestFormType_fk
      FOREIGN KEY (formTypeId)
      REFERENCES requestFormType (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
  )`);
};


exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS fieldCategory`);
};
