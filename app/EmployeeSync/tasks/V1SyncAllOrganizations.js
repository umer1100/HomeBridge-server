/**
 * EMPLOYEESYNC V1SyncAllOrganizations TASK
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean
const axios = require('axios'); // http requests
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

// services
const email = require('../../../services/email');
const { SOCKET_ROOMS, SOCKET_EVENTS } = require('../../../services/socket');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');
const { date } = require('@hapi/joi');

// helpers

// queues
const Queue = require('bull'); // process background tasks from Queue
const EmployeeSyncQueue = new Queue('EmployeeSyncQueue', REDIS_URL);

// methods
module.exports = {
  V1SyncAllOrganizations
};

/**
 * Starts process to sync each of the organizations which have Finch integration
 *
 * @job = {
 *   @id - (INTEGER - REQUIRED): ID of the background job
 *   @data = {
 *   }
 * }
 *
 * Success: Resolve without error
 *
 */
async function V1SyncAllOrganizations(job) {
  const schema = joi.object({});

  // validate
  const { error, value } = schema.validate(job.data);
  if (error) return Promise.resolve(new Error(joiErrorsMessage(error)));
  job.data = value; // updated arguments with type conversion

  let organizations = await models.organizations.findAll({ where: { hrisAccessToken: { [OP.ne]: null } } });

  organizations.forEach(organization => {
    (async () => {
      await EmployeeSyncQueue.add('V1Import', { organizationId: organization.id });
    })();
  });

  try {
    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1ExampleTask
