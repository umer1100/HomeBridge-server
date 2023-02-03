/**
 * CREDITWALLET V1ExampleTask TASK
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
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/
const convert = require('convert-units'); // https://www.npmjs.com/package/convert-units

// services
const email = require('../../../services/email');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers

// queues
const CreditWalletQueue = new Queue('CreditWalletQueue', REDIS_URL);

// methods
module.exports = {
  V1AddMonthlyCredit
};

/**
 * Adds credit to organization user's credit wallet
 *
 * @job = {
 *   @id - (INTEGER - REQUIRED): ID of the background job
 * }
 *
 */
async function V1AddMonthlyCredit(job) {
  const schema = joi.object({});

  // validate
  const { error, value } = schema.validate(job.data);
  if (error) return Promise.resolve(new Error(joiErrorsMessage(error)));
  job.data = value; // updated arguments with type conversion

  try {
    // Find all active users
    let activeUsers = models.user.findAll({
      where: {
        status: 'active'
      }
    });

    var today = moment(Date.now());
    // For each user, add 30 ownerific dollars, or a prorated amount based on when they signed up
    activeUsers.forEach(async user => {
      let credit = Math.min(30, today.diff(moment(user.createdAt), 'days'));
      await models.creditWallet.increment('ownerificDollars', { by: credit, where: { userId: user.id } });
    });

    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1AddMonthlyCredit
