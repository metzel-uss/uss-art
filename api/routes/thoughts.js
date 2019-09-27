const router = require('express').Router();
const db = require('../util/db');

/**
 * URL: localhost:5001/api/thoughts/
 * Response: Array of all Thought documents
 */
router.get('/', (req, res, next) => {
  db.query('SELECT * FROM inventory')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      next(err);
    });
});

/**
 * URL: localhost:5001/api/thoughts/create
 * Response: Newly created Thought object if successful
 */
router.post('/create', (req, res, next) => {
  const { thought } = req.body;

  db.query('INSERT INTO inventory (name, quantity) VALUES (?, ?)', [thought, 154])
    .then(result => {
      res.json({ newThought: { id: result.insertId, name: thought }, mes: 'success' });
    })
    .catch(err => {
      next(err);
    });


  // conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', [thought, 154],
  //   function (err, results, fields) {
  //     if (err) throw err;
  //     console.log('Inserted ' + results.affectedRows + ' row(s).');
  //     res.json({ newThought: { id: results.insertId, name: thought }, mes: 'success' });
  //   })
});

/**
 * URL: localhost:5001/api/thoughts/
 * Description: Deletes all Thoughts from DB
 */
router.delete('/', (req, res, next) => {
  db.query('DELETE FROM inventory')
    .then(result => {
      res.json({ mes: 'success' });
    })
    .catch(err => {
      next(err);
    });
  // conn.query('DELETE FROM inventory ',
  //   function (err, results, fields) {
  //     if (err) throw err;
  //     console.log('Deleted' + results.affectedRows + ' row(s).');
  //     res.json({ mes: 'success' });
  //   })
});


/*

TERMINATE CONNECTIONS SOMEWHERE IN THE MESS ABOVE
    conn.end(
        function (err) {
            if (err) throw err;
            else  console.log('Closing connection.')
        });
 */

module.exports = {
  endpoint: '/api/thoughts',
  router
};
