const dbUtil = require('../util/db');

exports.up = db => {
  return db.query(`CREATE TABLE autocompleteOptions (
    optKey VARCHAR(45) NOT NULL, -- "key" is a reserved word
    value VARCHAR(200) NOT NULL,
    fieldId INT NOT NULL,
    ${dbUtil.getTimestampFields()},
    PRIMARY KEY (optKey, fieldId),
    UNIQUE INDEX autocompleteOptions_fieldIdKeyUnique_idx (fieldId ASC, optKey ASC),
    CONSTRAINT autocompleteOptions_field_fk
      FOREIGN KEY (fieldId)
      REFERENCES field (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
  )`);
};

exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS autocompleteOptions`);
};
