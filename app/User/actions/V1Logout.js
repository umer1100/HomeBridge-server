/**
 * USER V1Logout ACTION
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party

const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helper
const { destroyExpiredAuthToken } = require('../../Session/helper')

// methods
module.exports = {
  V1Logout
}

/**
 * Method Description
 *
 * POST /v1/users/V1Logout
 *
 * Must be logged out | Must be logged in | Can be both logged in or logged out
 * Roles: ['admin', 'user']
 *
 * req.params = {}
 * req.args = {
 *    @userId - (STRING - REQUIRED)
 *    @jwt - (STRING - REQUIRED)
 * }
 *
 * Success: Return something
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 * !IMPORTANT: This is an important message
 * !NOTE: This is a note
 * TODO: This is a todo
 */
async function V1Logout(req, res) {
  const schema = joi.object({
    jwt: joi.string().trim().min(1).default(req.headers?.authorization)
  })

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  req.args = value;
  const { jwt } = req.args

  try {
    const destroyResponse = await destroyExpiredAuthToken(jwt?.replace('jwt-user ', ''))
    if (!destroyResponse) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

    // return
    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Logout
