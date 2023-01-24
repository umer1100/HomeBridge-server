'use strict';

const { PLAID_CLIENT_ID } = process.env;
const { linkTokenCreate } = require('../helper');

module.exports = {
  V1CreateLinkToken
};

/**
 * Method Description
 *
 * GET  /v1/plaidAccounts/createLinkToken
 * POST /v1/plaidAccounts/createLinkToken
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {}
 *
 * Success: Return something
 * Errors:
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 */

async function V1CreateLinkToken() {
  const request = {
    user: {
      client_user_id: PLAID_CLIENT_ID,
    },
    client_name: 'Ownerific',
    products: ['auth', 'transactions', 'identity'],
    country_codes: ['US'],
    language: 'en',
  };

  try {
    let res = await linkTokenCreate(request);

    return Promise.resolve({
      status: 200,
      success: true,
      data: res.data
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
