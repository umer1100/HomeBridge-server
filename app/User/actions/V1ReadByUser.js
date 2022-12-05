/**
 * USER V1ReadByUser ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { user, organization } = require('../../../models');
const { find } = require('../../../database/sequence');

// methods
module.exports = {
  V1ReadByUser
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
async function V1ReadByUser(req) {
  const schema = joi.object({
    id: joi.number().min(1).default(req.user.id).optional()
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
      },
      include: {
        model: organization,
        attributes: ['name', 'url', 'spendLimit']
      }
    })
    .catch(err => Promise.reject(error));

  // check if user exists
  if (!findUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  // allowed to access this resource
  if (req.user) {
    const { organizationId } = req.user;
    if (organizationId != findUser.organizationId) {
      return Promise.resolve(errorResponse(req, ERROR_CODES.UNAUTHORIZED));
    }
  }

  return Promise.resolve({
    status: 200,
    success: true,
    user: findUser.dataValues
  });
} // END V1Read
