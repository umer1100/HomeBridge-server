/**
 * ACCOUNT V1Example ACTION
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL, PLAID_CLIENT_ID, PLAID_CLIENT_SECRET, PLAID_CREATE_LINK_TOKEN_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const Op = require('sequelize').Op; // for model operator aliases like $gte, $eq
const io = require('socket.io-emitter')(REDIS_URL); // to emit real-time events to client-side applications: https://socket.io/docs/emit-cheatsheet/
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const axios = require('axios');
const plaid = require('plaid');

// services
const email = require('../../../services/email');
const { SOCKET_ROOMS, SOCKET_EVENTS } = require('../../../services/socket');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers
const { getOffset, getOrdering, convertStringListToWhereStmt } = require('../../../helpers/cruqd');
const { randomString } = require('../../../helpers/logic');
const { LIST_INT_REGEX } = require('../../../helpers/constants');

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
      .error(new Error(req.__('PLAIDACCOUNT_V1CreateAccessToken_Invalid_Argument[publicToken]')))
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
    const tokenExchange = plaidClient.itemPublicTokenExchange({ public_token: req.args.publicToken });
    const accessToken = tokenExchange.data.access_token;
    const itemId = tokenExchange.data.item_id;

    let accounts = req.args.accounts;

    accounts.forEach(account => {
      (async () => {
        await models.plaidAccount.create({
          account_id: account.id,
          name: account.name,
          accessToken: accessToken,
          itemId: itemId,
          mask: account.mask,
          type: account.type,
          subtype: account.subtype
        });
      })();
    });

    // return
    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Example
