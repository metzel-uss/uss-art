require('dotenv').config();
const fs = require('fs');
const db = require('../util/db');

const migrateMode = process.argv.length < 3 ? 'up' : process.argv[2].toLowerCase();
if (migrateMode === 'help') {
  console.log("Usage: npm run migrate [up | down | clean]");
  console.log("  up: Runs all not yet run migrations");
  console.log("  down: Reverses one migration");
  console.log("  clean: Reverses all migrations and reruns all migrations");
  process.exit();
}
else if (migrateMode !== 'up' && migrateMode !== 'down' && migrateMode !== 'clean') {
  console.log(`Invalid migrate mode ${migrateMode}.  Please enter 'up', 'down' or 'clean'`);
  process.exit();
}

const createMigrationsTableIfDoesNotExist = async () => {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS migrations (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(80) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX name_UNIQUE (name ASC)
    )`);
  } catch (e) {
    console.error("Could not create migrations table: ");
    console.error(e);
    process.exit(1);
  }
};

const getNotRunMigrations = async (fileNamesArray) => {
  await createMigrationsTableIfDoesNotExist();
  try {
    const results = await db.query(`SELECT fileNames.name
      FROM (
        ${fileNamesArray.map(fn => "SELECT ? AS name").join(' UNION ')}
      ) fileNames
      LEFT JOIN migrations ON (fileNames.name = migrations.name)
      WHERE migrations.name IS NULL
    `, fileNamesArray);
    return results;
  } catch (e) {
    console.error("Could not fetch unrun migrations: ");
    console.error(e);
    process.exit(5);
  }
};
const getRunMigrations = async () => {
  await createMigrationsTableIfDoesNotExist();
  try {
    const results = await db.query(`SELECT name FROM migrations`);
    return results;
  } catch (e) {
    console.error("Could not fetch migrations: ");
    console.error(e);
    process.exit(7);
  }
};

const getEveryMigrationFileName = () => {
  return new Promise((resolve, reject) => {
    const fileNameArray = [];
    fs.readdir(`${process.env.ROOT_DIR}/migrations/`, function (err, items) {
      if (err) {
        console.error("Could not get migration files: ");
        console.error(err);
        process.exit(4);
      }

      for (var i = 0; i < items.length; i++) {
        const file = items[i];
        if (file === 'index.js')
          continue;
        fileNameArray.push(file);
      }
      resolve(fileNameArray);
    });
  });
};

const insertToMigrationsTable = migrationName => {
  return db.query('INSERT INTO migrations (name) VALUES (?)', [migrationName]);
};
const removeFromMigrationsTable = migrationName => {
  return db.query('DELETE FROM migrations WHERE name = ?', [migrationName]);
};

const runMigrationFiles = async (fileNames, direction) => {
  const processFile = migrationName => {
    return new Promise(async (resolve, reject) => {
      console.log(`${direction === 'up' ? "Running" : "Reversing"} ${migrationName}`);
      const migration = require(`${process.env.ROOT_DIR}/migrations/${migrationName}`);
      try {
        if (direction === 'up')
          await migration.up(db);
        else
          await migration.down(db);
      } catch (e) {
        console.error(`Failed to run migration ${migrationName}: `);
        console.error(e);
        process.exit(8);
      }
      try {
        if (direction === 'up')
          await insertToMigrationsTable(migrationName);
        else
          await removeFromMigrationsTable(migrationName);
      } catch (e) {
        console.error(`Failed to insert to migration table: `);
        console.error(e);
        process.exit(9);
      }
      resolve();
    });
  };

  if (direction === 'up') {
    for (let i = 0; i < fileNames.length; i++) {
      await processFile(fileNames[i].name);
    }
  } else {
    for (let i = fileNames.length - 1; i >= 0; i--) {
      await processFile(fileNames[i].name);
    }
  }
};

const upMigrations = async () => {
  const fileNames = await getEveryMigrationFileName();

  if (fileNames.length === 0) {
    console.log("No migrations found!");
    process.exit();
  }

  const migrations = await getNotRunMigrations(fileNames);
  if (migrations.length === 0) {
    console.log("All migrations already run, nothing to do");
    process.exit();
  }

  await runMigrationFiles(migrations, 'up');

  console.log("Done running migrations");
  process.exit();
};

const downMigration = async () => {
  const fileNames = await getRunMigrations();

  if (fileNames.length === 0) {
    console.log("No migrations found!");
    process.exit();
  }

  const lastRunMigration = fileNames[fileNames.length - 1];
  await runMigrationFiles([lastRunMigration], 'down');

  console.log("Done reversing migration");
  process.exit();
};

const cleanDatabase = async () => {
  const fileNames = await getRunMigrations();

  if (fileNames.length > 0) {
    await runMigrationFiles(fileNames, 'down');
  }

  try {
    await db.query(`DROP TABLE IF EXISTS migrations`);
  } catch (e) {
    console.error("Could not drop migrations table:");
    console.error(e);
    process.exit(6);
  }

  upMigrations();
};

if (migrateMode === 'down') {
  downMigration();
} else if (migrateMode === 'clean') {
  cleanDatabase();
} else {
  upMigrations();
}
