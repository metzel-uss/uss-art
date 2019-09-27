const fs = require('fs');

// Configure the server to use every route file
function configure(app) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync('/home/site/wwwroot/api/routes')) {
      fs.readdir('/home/site/wwwroot/api/routes', function (err, items) {
        if (err) {
          reject(err);
          return;
        }
        if (!items) {
          reject("Could not get items");
          return;
        }
        for (var i = 0; i < items.length; i++) {
          const file = items[i];
          if (file === 'index.js')
            continue;
          const requiredFile = require(`./${file}`);
          app.use(requiredFile.endpoint, requiredFile.router);
        }
        resolve();
      });
    } else {
      reject('/home/site/wwwroot/api/routes does not exist!');
    }
  });
}

module.exports = { configure };
