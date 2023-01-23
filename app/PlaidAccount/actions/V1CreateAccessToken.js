/**
 * ACCOUNT V1CreateAccessToken ACTION
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
const { createDwollaCustomer, createDwollaCustomerFundingSource } = require('../../../services/dwolla');

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
    accounts: joi
      .array()
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

    const itemResponse = await axios.post('https://sandbox.plaid.com/item/get', {
      access_token: accessToken,
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_CLIENT_SECRET
    });

    let ssn = '123456789';
    let customerUrl = await createDwollaCustomer(
      req.user.firstName,
      req.user.lastName,
      ssn,
      req.user.email,
      req.user.addressLine1,
      req.user.city,
      req.user.state,
      req.user.zipcode,
      req.user.dateOfBirth
    );

    console.log(customerUrl);

    let accounts = req.args.accounts;

    accounts = await Promise.all(
      accounts.map(async account => {
        const processorRequest = {
          access_token: accessToken,
          account_id: account.id,
          processor: 'dwolla'
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(processorRequest);

        let processorToken = processorTokenResponse.data.processor_token;
        let fundingSourceUrl = await createDwollaCustomerFundingSource(account, customerUrl, processorToken);
        console.log(customerUrl);
        console.log(fundingSourceUrl);

        return {
          accountId: account.id,
          name: account.name,
          itemId: itemResponse?.data?.item?.item_id,
          mask: account.mask,
          type: account.type,
          subtype: account.subtype,
          custUrl: customerUrl,
          fundingSourceUrl: fundingSourceUrl,
          userId: req.user.id,
          accessToken,
          processorToken
        };
      })
    );

    console.log(accounts);

    await models.plaidAccount.bulkCreate(accounts);

    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1CreateAccessToken
