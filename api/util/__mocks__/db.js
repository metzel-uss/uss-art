const db = jest.genMockFromModule('../db');

db.query = () => {
  return new Promise(resolve => {
    resolve([
      { data: 'data' }
    ]);
  });
};

db.getConnection = () => { return {}; };

db.endConnection = () => {
  return new Promise(resolve => {
    resolve();
  });
};

db.getTimestampFields = () => { return "timestamp fields"; };

db.insert = () => {
  return new Promise(resolve => {
    resolve({ insertId: 1 });
  });
};

db.update = () => {
  return new Promise(resolve => {
    resolve({ data: "data" });
  });
};

db.multiUpdate = () => {
  return new Promise(resolve => {
    resolve({ });
  });
};

db.destroy = () => {
  return new Promise(resolve => {
    resolve({ });
  });
};

db.destroyAll = () => {
  return new Promise(resolve => {
    resolve({ });
  });
};



module.exports = db;
