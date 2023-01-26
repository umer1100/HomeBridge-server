/**
 * PLAIDACCOUNT V1CreateAccessToken ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');
<<<<<<< HEAD
const { createDwollaCustomer, createDwollaCustomerFundingSource } = require('../../../services/dwolla');

const { itemPublicTokenExchange, itemGet, processorTokenCreate } = require('../../../services/plaid');
=======

const { itemPublicTokenExchange, itemGet } = require('../helper');
>>>>>>> b0e2abc85a54804e4aee8d047a7729e57662bbe4

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
      access_token: accessToken
    });

    let ssn = '123456789'; // TODO: replace with Finch SSN call
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

    let accounts = req.args.accounts;

    accounts = await Promise.all(
      accounts.map(async account => {
        const processorRequest = {
          access_token: accessToken,
          account_id: account.id,
          processor: 'dwolla'
        };

        const processorToken = await processorTokenCreate(processorRequest);
        let fundingSourceUrl = await createDwollaCustomerFundingSource(account, customerUrl, processorToken);

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
          processorToken,
          institutionName: req?.args?.institutionName
        };
      })
    );

    await models.plaidAccount.bulkCreate(accounts);

    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1CreateAccessToken
