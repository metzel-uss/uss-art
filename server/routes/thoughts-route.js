const router = require('express').Router();
const mysql = require('mysql');
//const Thought = require('../models/Thought');
var config =
    {
        host: 'd5dev02iturtsql01.mysql.database.azure.com',
        user: 'p5dev02iturt01.svc@d5dev02iturtsql01',
        password: 'bZNWA1gCQszKYLKdgolzQBv1FnuK9CDikKeF0nf4P5hmtNoRYnfkJW6agpss',
        database: 'quickstartdb',
        port: 3306,
        ssl: true
    };

conn = new mysql.createConnection(config);
/**
 * URL: localhost:5001/api/thoughts/
 * Response: Array of all Thought documents
 */
router.get('/', (req, res, next) => {
    conn.query('SELECT * FROM quickstartdb.inventory;',
        function (err, results, fields) {
            if(results) {
                console.log('Selected ' + results.length + ' row(s).');
                const returnArr = [];
                for (i = 0; i < results.length; i++) {
                    returnArr.push(results[i]);
                    console.log('Row: ' + JSON.stringify(results[i]));
                }
                res.send(returnArr);
            }
            console.log('Done.');
        })
});

/**
 * URL: localhost:5001/api/thoughts/create
 * Response: Newly created Thought object if successful
 */
router.post('/create', (req, res, next) => {
    const { thought } = req.body;

    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', [thought, 154],
        function (err, results, fields) {
            if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
            res.json({newThought: {id: results.insertId, name: thought}, mes: 'success'});
        })
});

/**
 * URL: localhost:5001/api/thoughts/
 * Description: Deletes all Thoughts from DB
 */
router.delete('/', (req, res, next) => {
    conn.query('DELETE FROM inventory ',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Deleted' + results.affectedRows + ' row(s).');
            res.json({mes: 'success'});
        })
});


/*

TERMINATE CONNECTIONS SOMEWHERE IN THE MESS ABOVE
    conn.end(
        function (err) {
            if (err) throw err;
            else  console.log('Closing connection.')
        });
 */

module.exports = router;
