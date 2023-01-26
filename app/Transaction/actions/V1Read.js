/**
 * TRANSACTION V1Create ACTION
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const Op = require('sequelize').Op; // for model operator aliases like $gte, $eq
const io = require('socket.io-emitter')(REDIS_URL); // to emit real-time events to client-side applications: https://socket.io/docs/emit-cheatsheet/
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean
const currency = require('currency.js'); // handling currency operations (add, subtract, multiply) without JS precision issues: https://github.com/scurker/currency.js/

// services
const email = require('../../../services/email');
const { transferFunds } = require('../../../services/dwolla');
const { SOCKET_ROOMS, SOCKET_EVENTS } = require('../../../services/socket');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers

// queues
const TransactionQueue = new Queue('TransactionQueue', REDIS_URL);

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
 * req.args = {
 *   @accountId - (STRING - OPTIONAL): Transactions of a specific account
 * }
 *
 * Success: Return something
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 *
 * !IMPORTANT: This is an important message
 * !NOTE: This is a note
 * TODO: This is a todo
 */
async function V1Read(req) {
  const schema = joi.object({
    accountId: joi
      .number()
      .min(1)
      .optional()
      .error(new Error(req.__('TRANSACTION_V1Example_Invalid_Argument[sourcedAccountId]')))
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    let accounts = await models.plaidAccount.findAll({ where: { userId: req.user.id }, attributes: ['id'], raw: true });
    accounts = accounts.map(account => account.id);
    let transactions = await models.transaction.findAll({
      where: {
        [Op.or]: [{ sourcedAccountId: { [Op.in]: accounts } }, { fundedAccountId: { [Op.in]: accounts } }]
      },
      include: {
        model: models.plaidAccount,
        required: true
      },
      raw: true
    });

    // transactions = transactions.map(transaction => {
    //   amount, fundedAccountId;
    // });

    // console.log(transactions);

    // return
    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Create
