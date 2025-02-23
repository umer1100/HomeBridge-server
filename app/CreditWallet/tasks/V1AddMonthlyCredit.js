/**
 * CREDITWALLET V1AddMonthlyCredit TASK
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const Op = require('sequelize').Op; // for model operator aliases like $gte, $eq
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

// services
const email = require('../../../services/email');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers
const constants = require('../../../helpers/constants')

// queues

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
    let activeUsers = await models.user.findAll({
      where: {
        status: 'ACTIVE'
      }
    });

    // For each user, add credit ownerific dollars (currently set to $30)
    activeUsers.forEach(async user => {
      let credit = constants.CREDIT;
      await models.creditWallet.increment('dollars', { by: credit, where: { userId: user.id, walletType: 'PLATFORM' } });
    });

    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1AddMonthlyCredit
