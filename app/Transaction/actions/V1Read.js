/**
 * TRANSACTION V1Create ACTION
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const Op = require('sequelize').Op; // for model operator aliases like $gte, $eq
const moment = require('moment-timezone');

// services
const { transferFunds } = require('../../../services/dwolla');

// models
const models = require('../../../models');

// helpers

// methods
module.exports = {
  V1Read
};

/**
 * Read the user's transactions
 *
 * GET  /v1/transactions/read
 * POST /v1/transactions/read
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {}
 *
 * Success: Return list of transactions
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 */
async function V1Read(req) {
  try {
    let accounts = await models.plaidAccount.findAll({ where: { userId: req.user.id }, attributes: ['id'], raw: true });
    accounts = accounts.map(account => account.id);
    let transactions = await models.transaction.findAll({
      where: {
        [Op.or]: [{ sourcedAccountId: { [Op.in]: accounts } }, { fundedAccountId: { [Op.in]: accounts } }]
      },
      include: [
        {
          model: models.plaidAccount,
          as: 'fundedAccount',
          required: false,
          paranoid: false
        },
        {
          model: models.plaidAccount,
          as: 'sourceAccount',
          required: false,
          paranoid: false
        }
      ],
      raw: true
    });

    transactions = transactions.map(transaction => {
      return {
        fundedAccId: transaction['fundedAccount.id'],
        sourceAccId: transaction['sourceAccount.id'],
        fundedAccName: transaction['fundedAccount.name'],
        sourceAccName: transaction['sourceAccount.name'],
        fundedAccInstitutionName: transaction['fundedAccount.institutionName'],
        sourceAccInstitutionName: transaction['sourceAccount.institutionName'],
        amount: transaction['amount'],
        createdAt: moment(transaction['createdAt']).utc().format('MM/DD/YYYY, h:mm A'),
        status: transaction['status']
      };
    });

    // return
    return Promise.resolve({
      status: 200,
      success: true,
      data: transactions
    });
  } catch (error) {
    return Promise.reject(JSON.parse(error?.message)?.message || error);
  }
} // END V1Create
