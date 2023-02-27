'use strict';

// Make client for Dwolla APP
const Client = require('dwolla-v2').Client;
const dwolla = new Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
  environment: process.env.DWOLLA_APP_ENVIRONMENT
});

module.exports = {
  V1GetDwollaDetails
};

/**
 * Method Description
 *
 * GET  /v1/plaidAccounts/getDwollaDetails
 * POST /v1/plaidAccounts/getDwollaDetails
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @user - (STRING - REQUIRED): user object to get his account details
 * }
 *
 * Success: Return something
 * Errors:
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 */

async function V1GetDwollaDetails(req) {
  try {
    let dwollaUserDetails = await dwolla.get('customers', { email: req.user.email });

    return Promise.resolve({
      status: 200,
      success: true,
      data: dwollaUserDetails.body._embedded.customers[0]
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
