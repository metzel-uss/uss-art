const router = require('express').Router();
const db = require('../util/db');
const util = require('../util/util');

const tableName = 'fieldType';
const fillableFields = ['name', 'label'];
// const requiredOnInsertFields = fillableFields;


/**
 * @swagger
 *
 * definitions:
 *   NewFieldType:
 *     type: object
 *     required:
 *       - name
 *       - label
 *     properties:
 *       name:
 *         type: string
 *       label:
 *         type: string
 *   FieldType:
 *     allOf:
 *       - $ref: '#/definitions/NewFieldType'
 *       - type: object
 *       - properties:
 *           id:
 *             type: integer
 *   GetFieldType:
 *     allOf:
 *       - $ref: '#/definitions/FieldType'
 *       - type: object
 *       - properties:
 *           created_at:
 *             type: string
 *             format: date-time
 *           updated_at:
 *             type: string
 *             format: date-time
 */


/**
* @swagger
* /api/field-type:
*   get:
*     summary: Returns field types
*     produces:
*      - application/json
*     tags:
*       - fieldTypes
*     responses:
*       200:
*         description: Field types
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/GetFieldType'
*/
router.get('/', (req, res, next) => {
  db.query('SELECT * FROM ??', [tableName])
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      next(err);
    });
});


/**
* @swagger
* /api/field-type/{fieldTypeId}:
*   put:
*     summary: Updates a field type
*     produces:
*      - application/json
*     tags:
*       - fieldTypes
*     parameters:
*       - name: fieldTypeId
*         in: path
*         schema:
*           type: integer
*         required: true
*       - name: fieldType
*         in: body
*         description: The field type fields to update
*         schema:
*           $ref: '#/definitions/NewFieldType'
*     responses:
*       200:
*         description: Field type
*         schema:
*           $ref: '#/definitions/GetFieldType'
*/
router.put('/:fieldTypeId', (req, res, next) => {
  util.commonUpdate(tableName, fillableFields, 'fieldTypeId', req, res, next);
});


module.exports = {
  endpoint: '/api/field-type',
  router
};
