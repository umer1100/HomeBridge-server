/**
 * PROGRAM V1Read ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// methods
module.exports = {
  V1Read
};

/**
 * Read and return an organization
 *
 * GET  /v1/programs/read
 * POST /v1/programs/read
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {}
 *
 * Success: Return a program.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: PROGRAM_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Read(req) {

  // find program
  const findProgram = await models.program.findOne({
    where: {
      organizationId: req.user.organizationId
    }
  }).catch(error => Promise.reject(error));

  // check if program exists
  if (!findProgram) return Promise.resolve(errorResponse(req, ERROR_CODES.PROGRAM_BAD_REQUEST_PROGRAM_DOES_NOT_EXIST));

  return Promise.resolve({
    status: 200,
    success: true,
    program: findProgram.dataValues
  });
} // END V1Read
