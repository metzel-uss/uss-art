const router = require('express').Router();
const db = require('../util/db');
const util = require('../util/util');

const tableName = 'fieldCategory';
const fillableFields = ['name', 'formTypeId', 'sortOrder', 'required'];
const requiredOnInsertFields = ['name', 'formTypeId', 'sortOrder'];


/**
 * @swagger
 *
 * definitions:
 *   NewFieldCategory:
 *     type: object
 *     required:
 *       - formTypeId
 *       - name
 *       - sortOrder
 *     properties:
 *       formTypeId:
 *         type: integer
 *       name:
 *         type: string
 *       sortOrder:
 *         type: integer
 *       required:
 *         type: integer
 *   FieldCategory:
 *     allOf:
 *       - $ref: '#/definitions/NewFieldCategory'
 *       - type: object
 *       - properties:
 *           id:
 *             type: integer
 *   GetFieldCategory:
 *     allOf:
 *       - $ref: '#/definitions/FieldCategory'
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
* /api/field-category:
*   get:
*     summary: Returns field categories
*     produces:
*      - application/json
*     tags:
*       - fieldCategories
*     parameters:
*       - in: query
*         name: formTypeId
*         description: A form type filter
*         schema:
*           type: string
*       - in: query
*         name: formId
*         description: A form ID filter
*         schema:
*           type: string
*     responses:
*       200:
*         description: Field categories
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/GetFieldCategory'
*/
router.get('/', (req, res, next) => {
  let sql = `SELECT DISTINCT c.*
  FROM fieldCategory c
  JOIN (
    SELECT formType.id, formType.name, formType.sortOrder, form.id AS formId
    FROM requestFormType formType
    LEFT JOIN requestForm form ON (formType.id = form.formTypeId)
      WHERE formType.deleted_at IS NULL
  ) formType ON (c.formTypeId = formType.id `;
  const params = [];
  if (req.query.formTypeId) {
    sql += ` AND formType.id = ? `;
    params.push(req.query.formTypeId);
  }
  if (req.query.formId) {
    sql += ` AND formType.formId = ? `;
    params.push(req.query.formId);
  }
  sql += `)
    WHERE c.deleted_at IS NULL
  `;
  db.query(sql, params).then(result => {
    res.send(util.cleanFieldsForOutput(result));
  })
    .catch(err => {
      next(err);
    });
});


const sortOrderIsValidForRequiredCategory = (sortOrder, formTypeId) => {
  return new Promise(async (resolve) => {
    let sql = `SELECT 1 AS _error
      FROM fieldCategory
      WHERE required = 0 AND sortOrder < ? AND formTypeId = ?
      LIMIT 1`;
    let result;
    try {
      result = await db.query(sql, [sortOrder, formTypeId]);
    } catch (e) {
      next(e);
      return;
    }

    resolve(!result || !result.length);
  });
};


/**
* @swagger
* /api/field-category:
*   post:
*     summary: Creates a field category
*     produces:
*      - application/json
*     tags:
*       - fieldCategories
*     parameters:
*       - in: body
*         name: fieldCategory
*         description: The field category to create
*         schema:
*           $ref: '#/definitions/NewFieldCategory'
*     responses:
*       200:
*         description: Field category
*         schema:
*           $ref: '#/definitions/FieldCategory'
*/
router.post('/', async (req, res, next) => {
  // If category is required, make sure it's not after any non-required categories in sort order
  if (req.body.required && req.body.sortOrder && req.body.formTypeId) {
    const result = await sortOrderIsValidForRequiredCategory(req.body.sortOrder, req.body.formTypeId);
    if (!result) {
      res.status(400).send("All required categories must be at the top of the form");
      return;
    }
  }

  util.commonInsert(tableName, requiredOnInsertFields, fillableFields, req, res, next);
});


/**
* @swagger
* /api/field-category/bulk-update:
*   put:
*     summary: Updates many field categories
*     produces:
*      - application/json
*     tags:
*       - fieldCategories
*     parameters:
*       - name: fieldCategories
*         in: body
*         description: The fields to update.  
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/FieldCategory'
*     responses:
*       200:
*         description: Field categories
*         schema:
*           $ref: '#/definitions/GetFieldCategory'
*/
router.put('/bulk-update', async (req, res, next) => {
  const categories = req.body;
  if (!categories || !categories.length) {
    res.status(400).send("No body data found");
    return;
  }

  const allIds = [];
  const updates = {};
  let sqlConditions = [];
  let params = [];
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    if (!category || !category.id) {
      res.status(400).send("Invalid category data!");
      return;
    }
    allIds.push(category.id);

    const conditions = [];
    params.push(category.id);
    for (let j = 0; j < fillableFields.length; j++) {
      const fieldName = fillableFields[j];
      if (category[fieldName] !== undefined) {
        if (!updates[category.id])
          updates[category.id] = {};
        updates[category.id][fieldName] = category[fieldName];
        conditions.push(`?? != ?`);
        params.push(fieldName, category[fieldName]);
      }
    }
    if (!conditions.length) {
      params.pop();
    } else {
      sqlConditions.push(`(id = ? AND (${conditions.join(' OR ')}))`);
    }
  }

  let sql = `SELECT * FROM fieldCategory WHERE ${sqlConditions.join(' OR ')}`;
  let categoriesToBeUpdated;
  try {
    categoriesToBeUpdated = await db.query(sql, params);
  } catch (e) {
    next(e);
    return;
  }

  const returnCategories = async () => {
    let sql = `SELECT * FROM fieldCategory WHERE id IN (${'?,'.repeat(allIds.length - 1)}?) ORDER BY formTypeId, sortOrder, required`;
    try {
      const categories = await db.query(sql, allIds);
      res.send(categories);
    } catch (e) {
      next(e);
      return;
    }
  };

  if (!categoriesToBeUpdated || !categoriesToBeUpdated.length) {
    returnCategories();
  } else {
    // Make sure required sort orders are valid before doing any updates
    let updateSqlChunks = [];
    let updateSqlChunkParams = [];
    let allUpdateIds = [];
    params = [];
    for (let i = 0; i < categoriesToBeUpdated.length; i++) {
      const currentCategory = categoriesToBeUpdated[i];
      const id = currentCategory.id;
      allUpdateIds.push(id);
      const categoryUpdates = updates[id];
      const updateFieldNames = Object.keys(categoryUpdates);
      updateSqlChunks.push(`SELECT
        id,
        ${['formTypeId', 'sortOrder', 'required'].map(f => {
          if (updateFieldNames.includes(f)) {
            updateSqlChunkParams.push(categoryUpdates[f], f);
            return `? AS ??`;
          } else {
            updateSqlChunkParams.push(f);
            return `??`;
          }
        }).join(',')}
        FROM fieldCategory WHERE id = ?
      `);
      updateSqlChunkParams.push(id);
    }

    updateSqlChunks.push(`SELECT
      id,
      formTypeId,
      sortOrder,
      required
      FROM fieldCategory WHERE id NOT IN (${'?,'.repeat(allUpdateIds.length - 1)}?)
    `);
    updateSqlChunkParams = updateSqlChunkParams.concat(allUpdateIds);
    const requiredSql = `SELECT fc.formTypeId, MAX(fc.sortOrder) AS maxRequiredSortOrder FROM (${updateSqlChunks.join(' UNION ')}) fc WHERE required = 1 GROUP BY formTypeId`;
    const notRequiredSql = `SELECT fc.formTypeId, MIN(fc.sortOrder) AS minNotRequiredSortOrder FROM (${updateSqlChunks.join(' UNION ')}) fc WHERE required = 0 GROUP BY formTypeId`;

    sql = `SELECT required.formTypeId, minNotRequiredSortOrder, maxRequiredSortOrder
      FROM (${requiredSql}) required
      JOIN (${notRequiredSql}) notRequired ON (notRequired.formTypeId = required.formTypeId)
      WHERE minNotRequiredSortOrder < maxRequiredSortOrder`;

    try {
      const invalidSortOrders = await db.query(sql, [...updateSqlChunkParams, ...updateSqlChunkParams]);
      if (invalidSortOrders && invalidSortOrders.length) {
        res.status(400).send("All required categories must be at the top of the form");
        return;
      }
    } catch (e) {
      next(e);
      return;
    }

    const updateCategory = category => {
      return db.update(tableName, category.id, updates[category.id]);
    };

    const promisesArray = [];
    for (let i = 0; i < categoriesToBeUpdated.length; i++) {
      promisesArray.push(updateCategory(categoriesToBeUpdated[i]));
    }
    Promise.all(promisesArray).then(returnCategories).catch(err => {
      next(err);
      return;
    });
  }
});


/**
* @swagger
* /api/field-category/{fieldCategoryId}:
*   put:
*     summary: Updates a field category
*     produces:
*      - application/json
*     tags:
*       - fieldCategories
*     parameters:
*       - name: fieldCategoryId
*         in: path
*         schema:
*           type: integer
*         required: true
*       - name: fieldCategory
*         in: body
*         description: The field category fields to update
*         schema:
*           $ref: '#/definitions/NewFieldCategory'
*     responses:
*       200:
*         description: Field category
*         schema:
*           $ref: '#/definitions/GetFieldCategory'
*/
router.put('/:fieldCategoryId', async (req, res, next) => {
  // If category is required, make sure it's not after any non-required categories in sort order
  let { required, sortOrder, formTypeId } = req.body;
  const id = req.params.fieldCategoryId;

  // Check the existing sortOrder to see if it's changing and make sure it's valid
  let sql = `SELECT required, sortOrder, formTypeId FROM fieldCategory WHERE id = ?`;
  let result;
  try {
    result = await db.query(sql, [id]);
  } catch (e) {
    next(e);
    return;
  }

  if (!result || !result.length) {
    res.status(404).send(`Could not find field category with ID ${id}`);
    return;
  } else {
    const category = result[0];
    const requiredChange = (required || required === 0) && required !== category.required;
    const sortOrderChange = (sortOrder || sortOrder === 0) && sortOrder !== category.sortOrder;
    if (requiredChange || sortOrderChange) {
      if (required) {
        const result = await sortOrderIsValidForRequiredCategory((sortOrder || category.sortOrder), (formTypeId || category.formTypeId));
        if (!result) {
          res.status(400).send("All required categories must be at the top of the form");
          return;
        }
      } else {
        // Make sure there aren't any required categories after this category
        const sql = `SELECT 1 AS _error
          FROM fieldCategory
          WHERE required = 1 AND sortOrder > ? AND formTypeId = ?
          LIMIT 1`;
        let result;
        try {
          result = await db.query(sql, [(sortOrder || category.sortOrder), (formTypeId || category.formTypeId)]);
        } catch (e) {
          next(e);
          return;
        }

        if (result && result.length) {
          res.status(400).send("All required categories must be at the top of the form");
          return;
        }
      }
    }
  }

  util.commonUpdate(tableName, fillableFields, 'fieldCategoryId', req, res, next);
});


/**
* @swagger
* /api/field-category/{fieldCategoryId}:
*   delete:
*     summary: Deletes a field category
*     produces:
*      - application/json
*     tags:
*       - fieldCategories
*     parameters:
*       - name: fieldCategoryId
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
router.delete('/:fieldCategoryId', (req, res, next) => {
  util.commonDelete(tableName, 'fieldCategoryId', req, res, next);
});

module.exports = {
  endpoint: '/api/field-category',
  router
};
