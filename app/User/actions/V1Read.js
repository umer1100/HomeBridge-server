/**
 * USER V1Read ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { user } = require('../../../models');

// methods
module.exports = {
  V1Read
};

/**
 * Read and return an user
 *
 * GET  /v1/users/read
 * POST /v1/users/read
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @id - (NUMBER - REQUIRED): The id of an user
 * }
 *
 * Success: Return a user.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Read(req) {
  const schema = joi.object({
    id: joi.number().min(1).required()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // find user
  const findUser = await user
    .findByPk(req.args.id, {
      attributes: {
        exclude: user.getSensitiveData() // remove sensitive data
      }
    })
    .catch(err => Promise.reject(error));

  // allowed to access this resource
  if (req.user) {
    const { organizationId } = req.user
    if (organizationId != findUser.organizationId) {
      return Promise.resolve(errorResponse(req, ERROR_CODES.UNAUTHORIZED));
    }
  }


  // check if user exists
  if (!findUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  return Promise.resolve({
    status: 200,
    success: true,
    user: findUser.dataValues
  });
} // END V1Read
