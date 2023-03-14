/**
 * TRANSACTION V1Sync ACTION
 */

'use strict';

// services
const { readTransactions } = require('../../../services/dwolla');

// models
const models = require('../../../models');

// error
const { errorResponse } = require('../../../services/error');
const LOCAL_ERROR_CODES = require('../error')

// methods
module.exports = {
  V1Sync
};

/**
 * Sync the user's transactions
 *
 * GET  /v1/transactions/sync
 * POST /v1/transactions/sync
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {}
 *
 * Success: sync transections
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 */
async function V1Sync(req) {
  try {
    let account = await models.plaidAccount.findOne({
      where: { userId: req.user.id },
      attributes: ['custUrl']
    })
    if (!account) return Promise.resolve(errorResponse(req, LOCAL_ERROR_CODES.ACCOUNT_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST))

    const res = await readTransactions(account?.custUrl)
    if (!res) return Promise.resolve(errorResponse(req, LOCAL_ERROR_CODES.TRANSACTIONS_BAD_REQUEST_TRANSACTIONS_DOES_NOT_EXIST))

    await Promise.all(res?.body?._embedded.transfers.map(async transaction => {
      await models.transaction.update(
        { status: transaction.status },
        {
          where: {
            transferUrl: transaction._links.self.href
          }
        }
      );
    }))

    return Promise.resolve({
      status: 200,
      success: true,
    });

  } catch (error) {
    return Promise.reject(JSON.parse(error?.message)?.message || error);
  }
} // END V1Sync
