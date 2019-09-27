const dbUtil = require('../util/db');

exports.up = db => {
  return db.query(`CREATE TABLE requestForm (
    id INT NOT NULL AUTO_INCREMENT,
    formStatusId INT NOT NULL DEFAULT 1,
    formTypeId INT NOT NULL,
    ${dbUtil.getTimestampFields()},
    PRIMARY KEY (id),
    INDEX requestForm_type_fk_idx (formTypeId ASC),
    CONSTRAINT requestForm_type_fk
      FOREIGN KEY (formTypeId)
      REFERENCES requestFormType (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION,
    INDEX requestForm_status_fk_idx (formStatusId ASC),
    CONSTRAINT requestForm_status_fk
      FOREIGN KEY (formStatusId)
      REFERENCES requestFormStatus (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
  )`);
};

exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS requestForm`);
};
