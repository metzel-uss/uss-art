require('dotenv').config();

const fs = require('fs');
const db = require('../util/db');

const getEverySeederFileName = () => {
  return new Promise((resolve, reject) => {
    const fileNameArray = [];
    fs.readdir(`${process.env.ROOT_DIR}/seeders/`, function (err, items) {
      if (err) {
        console.error("Could not get seeder files: ");
        console.error(err);
        process.exit(1);
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

const runSeeders = fileNames => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < fileNames.length; i++) {
      const migrationName = fileNames[i];
      const migration = require(`${process.env.ROOT_DIR}/seeders/${migrationName}`);
      const {tableName, inserts} = migration;
      try {
        console.log(`Erasing contents of table ${tableName}`);
        await db.destroyAll(tableName);
      } catch (e) {
        console.error(`Could not clear table ${tableName}:`);
        console.error(e);
        process.exit(2);
      }
      let row;
      try {
        console.log(`Seeding table ${tableName}`);
        for (let j = 0; j < inserts.length; j++) {
          row = inserts[j];
          await db.insert(tableName, row);
        }
      } catch (e) {
        console.error(`Could not insert data into table ${tableName}:`);
        console.error(e);
        console.error(`Insert row:`);
        console.error(row);
        process.exit(3);
      }
    }
    resolve();
  });
};

const run = async () => {
  const fileNames = await getEverySeederFileName();

  if (fileNames.length === 0) {
    console.log("No seeders found!");
    process.exit();
  }

  await runSeeders(fileNames);

  console.log("Done running seeders");
  process.exit();
};


const env = (process.env.ENVIRONMENT || '').toLowerCase();
if (env === 'development' || env === 'localhost') {
  run();
} else {
  console.log("This command only runs in a development environment");
  process.exit();
}
