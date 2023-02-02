'use strict';

const models = require('../../../models');

module.exports = {
  V1GetUsersPlaidAccountDetails
};

/**
 * return all the plaid accounts associated with the organization of current user
 *
 * GET  /v1/organization/users-plaid-accounts
 * POST /v1/organization/users-plaid-accounts
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = { @user }
 *
 * Success: Return plaid accounts
 */

async function V1GetUsersPlaidAccountDetails(req) {
  try {
    let organizationData = await models.organization.findByPk(req.user.organizationId, {
      include: {
        model: models.user,
        include: {
          model: models.plaidAccount
        }
      }
    })

    let accountsInformation = organizationData.users.map((user) => {
      let { firstName, lastName, email } = user
      let data = user.plaidAccounts.map((acc) => {
        let { id, name, institutionName, accountId, itemId } = acc
        if (req.user.id != acc.userId) {
          return {
            user: {
              id: user.id,
              firstName,
              lastName,
              email
            },
            id,
            name,
            institutionName,
            accountId,
            itemId,
            label: ` ${firstName} ${lastName} | ${institutionName} | ${name}`
          }
        }
      })
      return data.filter(account => account).flat()
    }).flat()

    return Promise.resolve({
      status: 200,
      success: true,
      data: accountsInformation
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
