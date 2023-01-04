/**
 * EMPLOYEESYNC V1SyncAllOrganizations TASK
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const Op = require('sequelize').Op; // for model operator aliases like $gte, $eq
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean

// services
const email = require('../../../services/email');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers
const { createSync } = require('../helper');

// queues
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

  let organizations = await models.organization.findAll({ where: { hrisAccessToken: { [Op.ne]: null } } });

  organizations.forEach(organization => {
    (async () => {
      const currentRunId = await createSync(organization.id);
      await EmployeeSyncQueue.add('V1Import', { organizationId: organization.id, currentRunId: currentRunId });
    })();
  });

  try {
    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1ExampleTask
