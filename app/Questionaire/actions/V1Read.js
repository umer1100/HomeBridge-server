/**
 * USER V1Read ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { questionaire } = require('../../../models');

// methods
module.exports = {
  V1Read
};

/**
 * Read and return an user
 *
 * GET  /v1/questionnaire/read
 * POST /v1/questionnaire/read
 *
 * Must be logged in
 * Roles: ['EMPLOYEE']
 *
 * req.params = {}
 * req.args = {
 *   @id - (NUMBER - REQUIRED): The id of an user
 * }
 *
 * Success: Return a user.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: QUESTIONNAIRE_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Read(req) {
  const schema = joi.object({
    id: joi.number().min(1).default(req.user.id).optional()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // find user
  const userQuestionnaire = await questionaire
    .findOne({
      where: {
        userId: req.args.id
      }
    })
    .catch(error => Promise.reject(error));

  // check if user exists
  if (!userQuestionnaire) return Promise.resolve(errorResponse(req, ERROR_CODES.QUESTIONNAIRE_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  return Promise.resolve({
    status: 200,
    success: true,
    data: userQuestionnaire.dataValues
  });
} // END V1Read
