/**
 * PLAIDACCOUNT HELPER
 */

'use strict';

const { PLAID_CLIENT_ID, PLAID_CLIENT_SECRET, PLAID_GET_ITEM, PLAID_ENVIRONMENT } = process.env;

const plaid = require('plaid');

module.exports = {
  itemPublicTokenExchange,
  itemGet,
  identityGet,
  itemRemove
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

async function itemPublicTokenExchange(payload) {
  const tokenExchange = await plaidClient.itemPublicTokenExchange(payload);
  return tokenExchange;
}

async function itemGet(payload) {
  const itemResponse = await plaidClient.itemGet(payload);
  return itemResponse;
}

async function identityGet(payload) {
  const identityResponse = await plaidClient.identityGet(payload);
  return identityResponse;
}

async function itemRemove(payload) {
  const itemRemoveResponse = await plaidClient.itemRemove(payload);
  return itemRemoveResponse;
}

 