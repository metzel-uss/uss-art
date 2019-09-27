const router = require('express').Router();
const db = require('../util/db');
const util = require('../util/util');

const tableName = 'requestFormType';
const fillableFields = ['name', 'sortOrder'];
const requiredOnInsertFields = fillableFields;


/**
 * @swagger
 *
 * definitions:
 *   NewRequestFormType:
 *     type: object
 *     required:
 *       - name
 *       - sortOrder
 *     properties:
 *       name:
 *         type: string
 *       sortOrder:
 *         type: integer
 *   RequestFormType:
 *     allOf:
 *       - $ref: '#/definitions/NewRequestFormType'
 *       - type: object
 *       - properties:
 *           id:
 *             type: integer
 *   GetRequestFormType:
 *     allOf:
 *       - $ref: '#/definitions/RequestFormType'
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
* /api/request-form-type:
*   get:
*     summary: Returns request form types
*     produces:
*      - application/json
*     tags:
*       - requestFormType
*     responses:
*       200:
*         description: Request form types
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/GetRequestFormType'
*/
router.get('/', (req, res, next) => {
  util.commonGet(tableName, req, res, next);
});


/**
* @swagger
* /api/request-form-type:
*   post:
*     summary: Creates a request form type
*     produces:
*      - application/json
*     tags:
*       - requestFormType
*     parameters:
*       - in: body
*         name: fieldCategory
*         description: The request form type to create
*         schema:
*           $ref: '#/definitions/NewRequestFormType'
*     responses:
*       200:
*         description: Request form type
*         schema:
*           $ref: '#/definitions/RequestFormType'
*/
router.post('/', (req, res, next) => {
  util.commonInsert(tableName, requiredOnInsertFields, fillableFields, req, res, next);
});


/**
* @swagger
* /api/request-form-type/{requestFormTypeId}:
*   put:
*     summary: Updates a request form type
*     produces:
*      - application/json
*     tags:
*       - requestFormType
*     parameters:
*       - name: requestFormTypeId
*         in: path
*         schema:
*           type: integer
*         required: true
*       - name: requestFormType
*         in: body
*         description: The request form type to update
*         schema:
*           $ref: '#/definitions/NewRequestFormType'
*     responses:
*       200:
*         description: Request form type
*         schema:
*           $ref: '#/definitions/GetRequestFormType'
*/
router.put('/:requestFormTypeId', (req, res, next) => {
  util.commonUpdate(tableName, fillableFields, 'requestFormTypeId', req, res, next);
});


/**
* @swagger
* /api/request-form-type/{requestFormTypeId}:
*   delete:
*     summary: Deletes a request form type
*     produces:
*      - application/json
*     tags:
*       - requestFormType
*     parameters:
*       - name: requestFormTypeId
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
router.delete('/:requestFormTypeId', (req, res, next) => {
  util.commonDelete(tableName, 'requestFormTypeId', req, res, next);
});

module.exports = {
  endpoint: '/api/request-form-type',
  router
};
