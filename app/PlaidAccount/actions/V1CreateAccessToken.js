/**
 * ACCOUNT V1Example ACTION
 */

'use strict';

// ENV variables
const { PLAID_CLIENT_ID, PLAID_CLIENT_SECRET, PLAID_GET_ITEM, PLAID_ENVIRONMENT } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const axios = require('axios');
const plaid = require('plaid');

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// methods
module.exports = {
  V1CreateAccessToken
};

/**
 * Method Description
 *
 * GET  /v1/plaidaccounts/createaccesstoken
 * POST /v1/plaidaccounts/createaccesstoken
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @publicToken - (STRING - REQUIRED): Public token used to generate access token
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
      .error(new Error(req.__('PLAIDACCOUNT_V1CreateAccessToken_Invalid_Argument[accounts]')))
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    const configuration = new plaid.Configuration({
      basePath: plaid.PlaidEnvironments[PLAID_ENVIRONMENT],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_CLIENT_SECRET,
          'Plaid-Version': '2020-09-14'
        }
      }
    });

    const plaidClient = new plaid.PlaidApi(configuration);
    const tokenExchange = await plaidClient.itemPublicTokenExchange({ public_token: req.args.publicToken });
    const accessToken = tokenExchange.data.access_token;

    const itemResponse = await axios.post(PLAID_GET_ITEM, {
      'access_token': accessToken,
      'client_id': PLAID_CLIENT_ID,
      'secret': PLAID_CLIENT_SECRET
    })

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
        accessToken
      }
    })
    await models.plaidAccount.bulkCreate(accounts)
    // return
    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1CreateAccessToken
