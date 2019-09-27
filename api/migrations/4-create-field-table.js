const dbUtil = require('../util/db');

exports.up = db => {
  return db.query(`CREATE TABLE field (
    id INT NOT NULL AUTO_INCREMENT,
    categoryId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    sortOrder INT NOT NULL,
    typeId INT NOT NULL,
    dependentOnId INT NULL,
    dependentOnValue VARCHAR(100) NULL,
    options VARCHAR(300) NULL,
    elementOptions VARCHAR(300) NULL,
    ${dbUtil.getTimestampFields()},
    PRIMARY KEY (id),
    INDEX field_name_idx (name ASC),
    INDEX field_type_fk_idx (typeId ASC),
    INDEX field_category_fk_idx (categoryId ASC),
    UNIQUE INDEX field_uniqueCategoryAndSortOrder_idx (categoryId ASC, sortOrder ASC),
    UNIQUE INDEX field_uniqueCategoryAndName_idx (categoryId ASC, name ASC),
    CONSTRAINT field_type_fk
      FOREIGN KEY (typeId)
      REFERENCES fieldType (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION,
    CONSTRAINT field_category_fk
      FOREIGN KEY (categoryId)
      REFERENCES fieldCategory (id)
      ON DELETE RESTRICT
      ON UPDATE NO ACTION
  )`);
};

exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS field`);
};
