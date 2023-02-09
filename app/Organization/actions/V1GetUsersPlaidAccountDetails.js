'use strict';

const models = require('../../../models');
const { isEmployer } = require('../../User/helper');

module.exports = {
  V1GetUsersPlaidAccountDetails
};

/**
 * return all bank accounts if user is employer, else user's own bank accounts
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
  let options = !isEmployer(req.user) ? {
    where: { userId: req.user.id },
  } : {}

  try {
    let organizationData = await models.organization.findByPk(req.user.organizationId, {
      include: {
        model: models.user,
        include: {
          model: models.plaidAccount,
          ...options
        }
      }
    })

    let accountsInformation = organizationData.users.map((user) => {
      let { firstName, lastName, email } = user
      let data = user.plaidAccounts.map((acc) => {
        let { id, name, institutionName, accountId, itemId } = acc
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
