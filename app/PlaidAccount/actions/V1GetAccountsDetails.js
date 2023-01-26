'use strict';

const models = require('../../../models');
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const { identityGet } = require('../../../services/plaid');

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
    let plaidAccounts = await models.plaidAccount.findAll({
      where: {
        userId: req.user.id
      }
    });
    let uniqueAccessTokens = _.uniq(_.map(plaidAccounts, 'accessToken'));
    let accountsData = await Promise.all(
      uniqueAccessTokens.map(async accessToken => {
        let account = plaidAccounts.find(acc => acc.accessToken === accessToken);
        let itemData = await identityGet({
          access_token: accessToken
        });
        return {
          accounts: itemData?.data?.accounts,
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
    return Promise.reject(error);
  }
}
