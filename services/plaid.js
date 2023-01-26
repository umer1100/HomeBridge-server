'use strict';

const { PLAID_CLIENT_ID, PLAID_CLIENT_SECRET, PLAID_ENVIRONMENT } = process.env;

const plaid = require('plaid');

module.exports = {
  linkTokenCreate,
  itemPublicTokenExchange,
  itemGet,
  identityGet,
  itemRemove,
  processorTokenCreate
};

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

/**
 * Exchange public token for an access token
 *
 * payload contains @user object having @client_id, @client_name @products @country_codes @language
 *
 * Docs: https://plaid.com/docs/api/tokens/#linktokencreate
 */

async function linkTokenCreate(payload) {
  const response = await plaidClient.linkTokenCreate(payload);
  return response;
}

/**
 * Exchange public token for an access token
 *
 * payload contains @public_token
 *
 * Docs: https://plaid.com/docs/api/tokens/#itempublic_tokenexchange
 */

async function itemPublicTokenExchange(payload) {
  const tokenExchange = await plaidClient.itemPublicTokenExchange(payload);
  return tokenExchange;
}

/**
 * Retrieve an Item
 *
 * payload contains @access_token
 *
 * Docs: https://plaid.com/docs/api/items/#itemget
 */

async function itemGet(payload) {
  const itemResponse = await plaidClient.itemGet(payload);
  return itemResponse;
}

/**
 * Retrieve identity data
 *
 * payload contains @access_token
 *
 * Docs: https://plaid.com/docs/api/products/identity/#identityget
 */

async function identityGet(payload) {
  const identityResponse = await plaidClient.identityGet(payload);
  return identityResponse;
}

/**
 * Remove an Item
 *
 * payload contains @access_token
 *
 * Docs: https://plaid.com/docs/api/items/#itemremove
 */

async function itemRemove(payload) {
  const itemRemoveResponse = await plaidClient.itemRemove(payload);
  return itemRemoveResponse;
}

/**
 * Remove an Item
 *
 * payload contains @access_token @account_id @processor
 *
 * Docs: https://plaid.com/docs/api/items/#itemremove
 */
async function processorTokenCreate(payload) {
  const processorTokenResponse = await plaidClient.processorTokenCreate(payload);
  return processorTokenResponse.data.processor_token;
}
