exports.up = db => {
  return db.query(`CREATE TABLE fieldType (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    label VARCHAR(80) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(), -- Include these fields manually because deleted_at is not needed in this table
    PRIMARY KEY (id),
    UNIQUE INDEX name_UNIQUE (name ASC))
  `);
};

exports.down = db => {
  return db.query(`DROP TABLE IF EXISTS fieldType`);
};
