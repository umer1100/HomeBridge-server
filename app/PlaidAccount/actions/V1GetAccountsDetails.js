'use strict';

const models = require('../../../models');
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const { identityGet, sandboxItemResetLoginRequest, linkTokenCreate } = require('../../../services/plaid');
const { PLAID_CLIENT_ID } = process.env;

module.exports = {
  V1GetAccountsDetails
};

/**
 * Method Description
 *
 * GET  /v1/plaidAccounts/getAccountsDetails
 * POST /v1/plaidAccounts/getAccountsDetails
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

async function V1GetAccountsDetails(req) {
  try {
    // fetch all plaid accounts for user that exist in our DB
    let plaidAccounts = await models.plaidAccount.findAll({
      where: {
        userId: req.user.id
      }
    });

    // since access_token can be same for different account in the same bank
    let uniqueAccessTokens = _.uniq(_.map(plaidAccounts, 'accessToken'));

    let accountsData = await Promise.all(
      uniqueAccessTokens.map(async accessToken => {
        let account = plaidAccounts.find(acc => acc.accessToken === accessToken);

        // make a call to plaid identity api to fetch latest account balances
        let itemData = await identityGet({
          access_token: accessToken
        });

        // we need respective ids (primary keys) from our database
        let accounts = itemData?.data?.accounts.map(account => {
          let { id, primaryAccount, createdAt } = plaidAccounts.find(acc => acc.accountId === account.account_id);
          return { id, primaryAccount, createdAt, ...account };
        });

        return {
          accounts,
          institutionName: account.institutionName,
          itemId: account.itemId
        };
      })
    );

    return Promise.resolve({
      status: 200,
      success: true,
      data: accountsData
    });
  } catch (error) {
    if (error.response.data.error_code === 'ITEM_LOGIN_REQUIRED') {
      const config = {
        user: {
          client_user_id: PLAID_CLIENT_ID
        },
        client_name: 'Ownerific',
        country_codes: ['US'],
        language: 'en',
        access_token: JSON.parse(error.response.config.data).access_token
      };
      let response = await linkTokenCreate(config);

      return Promise.resolve({
        status: 401,
        success: false,
        data: response.data,
        message: '[ITEM_LOGIN_REQUIRED] Need to update authentication or authorization for plaid item',
      });
    }

    return Promise.reject(error);
  }
}
