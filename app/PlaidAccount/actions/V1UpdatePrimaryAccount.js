'use strict';

const models = require('../../../models');
const joi = require('@hapi/joi');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

module.exports = {
  V1UpdatePrimaryAccount
};

/**
 * Updates one of the user's accounts to a primary account
 *
 * GET  /v1/plaidAccounts/updatePrimaryAccount
 * POST /v1/plaidAccounts/updatePrimaryAccount
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {
 *  @plaidAccountId - (STRING - REQUIRED): id of account to update to primary
 * }
 * req.args = {}
 *
 * Success: Return something
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 */

async function V1UpdatePrimaryAccount(req) {
  const schema = joi.object({
    plaidAccountId: joi.number().min(1).required()
  });

  const { error, value } = schema.validate(req.args);

  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value;

  // find plaidAccount
  const findPlaidAccount = await models.plaidAccount.findByPk(req.args.plaidAccountId).catch(err => Promise.reject(err));

  // check if plaid account exists
  if (!findPlaidAccount) return Promise.resolve(errorResponse(req, ERROR_CODES.PLAIDACCOUNT_BAD_REQUEST_PLAIDACCOUNT_DOES_NOT_EXIST));

  try {
    await models.plaidAccount.update(
      { primaryAccount: false },
      {
        where: {
          userId: req.user.id
        }
      }
    );

    await models.plaidAccount.update(
      { primaryAccount: true },
      {
        where: {
          id: req.args.plaidAccountId
        }
      }
    );

    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, error));
  }
}
