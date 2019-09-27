const router = require('express').Router();
const db = require('../util/db');
const util = require('../util/util');



/**
 * @swagger
 *
 * definitions:
 *   BasicRequestFormHistoryEntry:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       requestFormId:
 *         type: integer
 *       formState:
 *         type: string
 *   RequestFormHistoryEntry:
 *     allOf:
 *       - $ref: '#/definitions/BasicRequestFormHistoryEntry'
 *       - type: object
 *       - properties:
 *           changes:
 *             type: string
 *           updatedBy:
 *             type: string
 *           updated_at:
 *             type: string
 *             format: date-time
 */


const cleanFormData = formData => {
  if (!formData || formData.length === 0)
    return formData;

  for (let i = 0; i < formData.length; i++) {
    if (formData[i].formState)
      formData[i].formState = JSON.parse(formData[i].formState.toString());
    if (formData[i].changes)
      formData[i].changes = JSON.parse(formData[i].changes.toString());
  }
  return formData;
};

/**
* @swagger
* /api/request-form-history:
*   get:
*     summary: Returns the current state of request forms
*     produces:
*      - application/json
*     tags:
*       - requestFormHistory
*     responses:
*       200:
*         description: Most recent request form history entries for each request form
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/BasicRequestFormHistoryEntry'
*/
router.get('/', async (req, res, next) => {
  let sql = `SELECT r.id, r.requestFormId, r.formState
    FROM requestFormHistory r
    JOIN (
      SELECT MAX(id) AS id, requestFormId
      FROM requestFormHistory
      GROUP BY requestFormId
    ) maxIds ON (r.id = maxIds.id)
    GROUP BY r.requestFormId
    ORDER BY r.updated_at DESC`;
  let formData;
  try {
    formData = await db.query(sql);
  } catch (e) {
    next(e);
    return;
  }

  res.send(cleanFormData(formData));
});


/**
* @swagger
* /api/request-form-history/{requestFormHistoryId}:
*   get:
*     summary: Returns the history entry with the specified ID
*     produces:
*      - application/json
*     tags:
*       - requestFormHistory
*     parameters:
*       - name: requestFormHistoryId
*         in: path
*         schema:
*           type: integer
*         required: true
*     responses:
*       200:
*         description: The specified history ID
*         schema:
*           $ref: '#/definitions/RequestFormHistoryEntry'
*/
router.get('/:requestFormHistoryId', async (req, res, next) => {
  const requestFormHistoryId = req.params.requestFormHistoryId;
  let sql = `SELECT r.*
    FROM requestFormHistory r
    WHERE r.id = ?
    GROUP BY r.requestFormId
    ORDER BY r.updated_at DESC`;
  let formData;
  try {
    formData = await db.query(sql, [requestFormHistoryId]);
  } catch (e) {
    next(e);
    return;
  }

  res.send(cleanFormData(formData));
});


/**
* @swagger
* /api/request-form-history/form/{requestFormId}:
*   get:
*     summary: Returns the history of the specified request form
*     produces:
*      - application/json
*     tags:
*       - requestFormHistory
*     parameters:
*       - name: requestFormId
*         in: path
*         schema:
*           type: integer
*         required: true
*     responses:
*       200:
*         description: History records for the specified request form
*         schema:
*           $ref: '#/definitions/RequestFormHistoryEntry'
*/
router.get('/form/:requestFormId', async (req, res, next) => {
  const requestFormId = req.params.requestFormId;
  let sql = `SELECT r.*
    FROM requestFormHistory r
    WHERE r.requestFormId = ?
    ORDER BY r.updated_at DESC`;
  let formData;
  try {
    formData = await db.query(sql, [requestFormId]);
  } catch (e) {
    next(e);
    return;
  }

  res.send(cleanFormData(formData));
});


module.exports = {
  endpoint: '/api/request-form-history',
  router
};
