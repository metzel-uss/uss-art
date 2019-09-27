exports.up = db => {
  return db.query(`CREATE TABLE requestFormHistory (
    id INT NOT NULL AUTO_INCREMENT,
    requestFormId INT NOT NULL,
    formState BLOB NOT NULL,
    changes BLOB,
    updatedBy VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    PRIMARY KEY (id),
    INDEX requestFormHistory_form_fk_idx (requestFormId ASC),
    CONSTRAINT requestFormHistory_form_fk
      FOREIGN KEY (requestFormId)
      REFERENCES requestForm (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
  )`);
};

exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS requestFormHistory`);
};
