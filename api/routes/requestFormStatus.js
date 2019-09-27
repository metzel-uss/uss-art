const router = require('express').Router();
const db = require('../util/db');
const util = require('../util/util');

const tableName = 'requestFormStatus';
const fillableFields = ['name'];
const requiredOnInsertFields = fillableFields;


/**
 * @swagger
 *
 * definitions:
 *   NewFormStatus:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *   FormStatus:
 *     allOf:
 *       - $ref: '#/definitions/NewFormStatus'
 *       - type: object
 *       - properties:
 *           id:
 *             type: integer
 *   GetFormStatus:
 *     allOf:
 *       - $ref: '#/definitions/FormStatus'
 *       - type: object
 *       - properties:
 *           created_at:
 *             type: string
 *             format: date-time
 *           updated_at:
 *             type: string
 *             format: date-time
 *           deleted_at:
 *             type: string
 *             format: date-time
 */


/**
* @swagger
* /api/request-form-status:
*   get:
*     summary: Returns form statuses
*     produces:
*      - application/json
*     tags:
*       - requestFormStatus
*     responses:
*       200:
*         description: Request form statuses
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/GetFormStatus'
*/
router.get('/', (req, res, next) => {
  util.commonGet(tableName, req, res, next);
});


/**
* @swagger
* /api/request-form-status:
*   post:
*     summary: Creates a request form status
*     produces:
*      - application/json
*     tags:
*       - requestFormStatus
*     parameters:
*       - in: body
*         name: requestFormStatus
*         description: The status to create
*         schema:
*           $ref: '#/definitions/NewFormStatus'
*     responses:
*       200:
*         description: Form status
*         schema:
*           $ref: '#/definitions/GetFormStatus'
*/
router.post('/', async (req, res, next) => {
  util.commonInsert(tableName, requiredOnInsertFields, fillableFields, req, res, next);
});


/**
* @swagger
* /api/request-form-status/{requestFormStatusId}:
*   put:
*     summary: Updates a request form status
*     produces:
*      - application/json
*     tags:
*       - requestFormStatus
*     parameters:
*       - name: requestFormStatusId
*         in: path
*         schema:
*           type: integer
*         required: true
*       - name: requestFormStatus
*         in: body
*         description: The status to create
*         schema:
*           $ref: '#/definitions/NewFormStatus'
*     responses:
*       200:
*         description: Form status
*         schema:
*           $ref: '#/definitions/GetFormStatus'
*/
router.put('/:requestFormStatusId', async (req, res, next) => {
  util.commonUpdate(tableName, fillableFields, 'requestFormStatusId', req, res, next);
});


/**
* @swagger
* /api/request-form-status/{requestFormStatusId}:
*   delete:
*     summary: Deletes a request form status
*     produces:
*      - application/json
*     tags:
*       - requestFormStatus
*     parameters:
*       - name: requestFormStatusId
*         in: path
*         schema:
*           type: integer
*         required: true
*     responses:
*       200:
*         description: Success confirmation
*         schema:
*           type: object
*           properties:
*             success:
*               type: boolean
*/
router.delete('/:requestFormStatusId', async (req, res, next) => {
  // Check if this ID can be deleted
  let sql = `SELECT canBeDeleted FROM requestFormStatus WHERE id = ?`;
  let params = [req.params.requestFormStatusId];
  let results;
  try {
    results = await db.query(sql, params);
  } catch (e) {
    next(e);
    return;
  }
  if (!results || !results.length) {
    res.status(404).send(`Could not find a status with ID ${req.params.requestFormStatusId}`);
  } else if (results[0].canBeDeleted === 0) {
    res.status(400).send(`This field cannot be deleted`);
  } else {
    util.commonDelete(tableName, 'requestFormStatusId', req, res, next);
  }
});

module.exports = {
  endpoint: '/api/request-form-status',
  router
};
