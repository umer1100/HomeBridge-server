/**
 * TRANSACTION V1Create ACTION
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { transferFunds } = require('../../../services/dwolla');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers

// methods
module.exports = {
  V1Create
};

/**
 * Processes a transaction through Dwolla and stores the log internally
 *
 * GET  /v1/transactions/create
 * POST /v1/transactions/create
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @sourcedAccountId - (NUMBER - REQUIRED): Primary key of the account from which the money is flowing form
 *   @fundedAccountId - (NUMBER - REQUIRED): Primary key of the account from which the money is flowing to
 *   @amount - (NUMBER - REQUIRED): amount of money that is going from the sourced account to the funded account
 * }
 *
 * Success: Return successful response
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 */
async function V1Create(req) {
  const schema = joi.object({
    sourcedAccountId: joi
      .number()
      .min(1)
      .required()
      .error(new Error(req.__('TRANSACTION_V1Example_Invalid_Argument[sourcedAccountId]'))),
    fundedAccountId: joi
      .number()
      .min(1)
      .required()
      .error(new Error(req.__('TRANSACTION_V1Example_Invalid_Argument[sourcedAccountId]'))),
    amount: joi
      .number()
      .min(1)
      .required()
      .error(new Error(req.__('TRANSACTION_V1Example_Invalid_Argument[sourcedAccountId]')))
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    let sourcedAccount = await models.plaidAccount.findByPk(req.args.sourcedAccountId);
    let fundedAccount = await models.plaidAccount.findByPk(req.args.fundedAccountId);

    let transferUrl = await transferFunds(sourcedAccount.fundingSourceUrl, fundedAccount.fundingSourceUrl, req.args.amount);

    await models.transaction.create({
      contributionType: 'DEFAULT',
      amount: req.args.amount,
      sourcedAccountId: sourcedAccount.id,
      fundedAccountId: fundedAccount.id,
      transferUrl: transferUrl
    });

    // return
    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(JSON.parse(error?.message)?.message || error);
  }
} // END V1Create
