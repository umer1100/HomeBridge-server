/**
 * CREDITWALLET V1Add ACTION
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
  V1Add
};

/**
 * Add to an existing credit wallet
 *
 * GET  /v1/creditwallets/add
 * POST /v1/creditwallets/add
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @userId - (NUMBER - REQUIRED): The id of the user whose wallet is being updated
 *   @creditAmount   - (NUMBER - REQUIRED): The amount added to the credit wallet
 *   @description    - (TEXT - REQUIRED): The amount added to the credit wallet
 * }
 *
 * Success: Return a credit wallet.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: CREDITWALLET_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 * TODO: Check to make sure the user adding money in is either an admin or part of the same organization as a EMPLOYER
 */
async function V1Add(req) {
  const schema = joi.object({
    userId: joi.number().min(1).required(),
    creditAmount: joi.number().min(0).required(),
    description: joi.string().trim().min(1).optional()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion
  // update and find credit wallet
  await models.creditWallet.increment('ownerificDollars', {
    by: req.args.creditAmount,
    where: { userId: req.args.userId }
  });

  let returnCreditWallet = await models.creditWallet.findOne({ where: { userId: req.args.userId } });

  return Promise.resolve({
    status: 200,
    success: true,
    data: returnCreditWallet.dataValues
  });
} // END V1Add
