'use strict';

const models = require('../../../models');
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const { identityGet } = require('../helper');

module.exports = {
  V1GetAccountsDetails
};

async function V1GetAccountsDetails(req) {
  try {
    let plaidAccounts = await models.plaidAccount.findAll({
      where: {
        userId: req.user.id
      }
    });
    let uniqueAccessTokens = _.uniq(_.map(plaidAccounts, 'accessToken'))
    let accountsData = await Promise.all(uniqueAccessTokens.map(async(accessToken) => {
      let account = plaidAccounts.find(acc => acc.accessToken === accessToken)
      let itemData = await identityGet({
        access_token: accessToken
      });
      return {
        accounts: itemData?.data?.accounts,
        institutionName: account.institutionName,
        itemId: account.itemId
      }
    }))

    return Promise.resolve({
      status: 200,
      success: true,
      data: accountsData
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
