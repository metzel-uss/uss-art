const dbUtil = require('../util/db');

exports.up = db => {
  return db.query(`CREATE TABLE fieldToRequestForm (
    requestFormId INT NOT NULL,
    fieldId INT NOT NULL,
    value VARCHAR(1000) NOT NULL,
    ${dbUtil.getTimestampFields()},
    PRIMARY KEY (requestFormId, fieldId),
    INDEX fieldToRequestForm_field_fk_idx (fieldId ASC),
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
