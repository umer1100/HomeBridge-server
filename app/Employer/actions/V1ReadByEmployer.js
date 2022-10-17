/**
 * EMPLOYER V1Read ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');
const employer = require('../../../test/fixtures/fix1/employer');

// methods
module.exports = {
  V1ReadByEmployer
};

/**
 * Read and return an employer
 *
 * GET  /v1/employers/read
 * POST /v1/employers/read
 *
 * Must be logged in
 * Roles: ['employer']
 *
 * req.params = {}
 * req.args = {
 *   @id - (NUMBER - OPTIONAL) [DEFAULT - req.employer.id]: The id of an employer
 * }
 *
 * Success: Return a employer.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: ADMIN_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1ReadByEmployer(req) {
  const schema = joi.object({
    id: joi.number().min(1).default(req.employer.id).optional()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // ensure argument id is the same as the employer id (only self read is allowed)
  if (req.args.id != req.employer.id) return Promise.resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_UNAUTHORIZED_ACCESS));

  // find employer
  const findEmployer = await models.employer
    .findByPk(req.args.id, {
      attributes: {
        exclude: models.employer.getSensitiveData() // remove sensitive data
      }
    })
    .catch(err => Promise.reject(error));

  // check if employer exists
  if (!findEmployer) return Promise.resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  return Promise.resolve({
    status: 200,
    success: true,
    employer: findEmployer.dataValues
  });
} // END V1Read
