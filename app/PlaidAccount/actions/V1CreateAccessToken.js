/**
 * PLAIDACCOUNT V1CreateAccessToken ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

const { itemPublicTokenExchange, itemGet } = require('../helper');

// models
const models = require('../../../models');

// methods
module.exports = {
  V1CreateAccessToken
};

/**
 * Method Description
 *
 * GET  /v1/plaidAccounts/createAccessToken
 * POST /v1/plaidAccounts/createAccessToken
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @publicToken - (STRING - REQUIRED): Public token used to generate access token
 *   @accounts - (Array - REQUIRED): Accounts array return by plaid onSuccess method
 *   @institutionName - (STRING - REQUIRED): Bank name or plaid item name
 * }
 *
 * Success: Return something
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 */
async function V1CreateAccessToken(req) {
  const schema = joi.object({
    publicToken: joi
      .string()
      .trim()
      .min(1)
      .required()
      .error(new Error(req.__('PLAIDACCOUNT_V1CreateAccessToken_Invalid_Argument[publicToken]'))),
    accounts: joi.array()
      .required()
      .error(new Error(req.__('PLAIDACCOUNT_V1CreateAccessToken_Invalid_Argument[accounts]'))),
    institutionName: joi
    .string()
    .trim()
    .min(1)
    .required()
    .error(new Error(req.__('PLAIDACCOUNT_V1CreateAccessToken_Invalid_Argument[institutionName]'))),
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    const tokenExchange = await itemPublicTokenExchange({ public_token: req.args.publicToken });
    const accessToken = tokenExchange.data.access_token;

    const itemResponse = await itemGet({
      'access_token': accessToken
    });

    let accounts = req.args.accounts;
    accounts = accounts.map(account => {
      return {
        accountId: account.id,
        name: account.name,
        itemId: itemResponse?.data?.item?.item_id,
        mask: account.mask,
        type: account.type,
        subtype: account.subtype,
        userId: req.user.id,
        accessToken,
        institutionName: req?.args?.institutionName
      }
    })
    await models.plaidAccount.bulkCreate(accounts)

    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1CreateAccessToken
