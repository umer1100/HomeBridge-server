/**
 * CLOSER V1Query ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers
const { getOffset, getOrdering } = require('../../../helpers/cruqd');

// methods
module.exports = {
  V1Query
}

/**
 * Query and return resources
 *
 * GET  /v1/closers/query
 * POST /v1/closers/query
 *
 * Must be logged in
 * Roles: ['user', 'admin']
 *
 * req.params = {}
 * req.args = {
 *   @active - (BOOLEAN - OPTIONAL): Whether active or not
 *
 *   @sort - (STRING - OPTIONAL) DEFAULT id, A comma separated list of columns of a table, could have a '-' in front which means descending, ex. id,-name,date
 *   @page - (NUMBER - OPTIONAL) The page number which must be greater than 0 DEFAULT 1
 *   @limit - (NUMBER - OPTIONAL) The number of elements per page which must be greater than 0 DEFAULT 10
 * }
 *
 * Success: Return resources.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Query(req) {
  const schema = joi.object({
    active: joi.boolean().optional(),

    // query params
    sort: joi.string().min(1).default('id').optional(),
    page: joi.number().integer().min(1).default(1).optional(),
    limit: joi.number().integer().min(1).default(25).optional()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error)
    return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // grab
  const sort = req.args.sort;
  const page = req.args.page;
  const limit = req.args.limit;

  // delete so it won't show up in where statement
  delete req.args.sort;
  delete req.args.page;
  delete req.args.limit;

  // add to where statement
  const whereStmt = {};
  Object.keys(req.args).forEach(key => {
    whereStmt[key] = req.args[key];
  });

  // get closers
  const result = await models.closer.findAndCountAll({
    where: whereStmt,
    limit: limit,
    offset: getOffset(page, limit),
    order: getOrdering(sort),
    include: {
      model: models.address,
    }
  }).catch(err => Promise.reject(err));

  // return success
  return Promise.resolve({
    status: 200,
    success: true,
    closers: result.rows, // all resources
    page: page,
    limit: limit,
    total: result.count, // the total count
    totalPages: Math.ceil(result.count / limit)
  });
} // END V1Query
