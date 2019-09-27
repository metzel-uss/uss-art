const dbUtil = require('../util/db');

exports.up = db => {
  return db.query(`CREATE TABLE fieldToRequestForm (
    id INT NOT NULL AUTO_INCREMENT,
    requestFormId INT NOT NULL,
    fieldId INT NOT NULL,
    rowId INT NULL,
    value VARCHAR(1000) NOT NULL,
    ${dbUtil.getTimestampFields()},
    PRIMARY KEY (id),
    UNIQUE INDEX fieldToRequestForm_fields_UNIQUE (requestFormId, fieldId, rowId),
    INDEX fieldToRequestForm_field_fk_idx (fieldId ASC),
    INDEX fieldToRequestForm_row_idx (rowId ASC),
    CONSTRAINT fieldToRequestForm_field_fk
      FOREIGN KEY (fieldId)
      REFERENCES field (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION,
    CONSTRAINT fieldToRequestForm_requestForm_fk
      FOREIGN KEY (requestFormId)
      REFERENCES requestform (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
  )`);
};

exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS fieldToRequestForm`);
};
