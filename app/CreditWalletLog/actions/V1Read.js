/**
 * CREDITWALLETLOG V1Read ACTION
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
 * Read and return the logs for a credit wallet
 *
 * GET  /v1/creditwalletlogs/read
 * POST /v1/creditwalletlogs/read
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @id - (NUMBER - REQUIRED): The id of a credit wallet
 * }
 *
 * Success: Return a credit wallet.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: CREDITWALLET_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
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

  // find credit wallet logs
  const findCreditWalletLogs = await models.creditWalletLog.findAll({ where: { creditWalletId: req.args.id } })

  // check if credit wallet logs exists
  if (!findCreditWalletLogs) return Promise.resolve(errorResponse(req, ERROR_CODES.CREDITWALLETLOG_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  return Promise.resolve({
    status: 200,
    success: true,
    data: findCreditWalletLogs
  });
} // END V1Read
