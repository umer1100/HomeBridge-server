/**
 * ORGANIZATION V1ExampleTask TASK
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
const got = require('got');

// services
const email = require('../../../services/email');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers
const { getOffset, getOrdering, convertStringListToWhereStmt } = require('../../../helpers/cruqd');
const { randomString } = require('../../../helpers/logic');
const { LIST_INT_REGEX } = require('../../../helpers/constants');

// queues
const OrganizationQueue = new Queue('OrganizationQueue', REDIS_URL);

// methods
module.exports = {
  V1ExampleTask
};

/**
 * Method Description
 *
 * @job = {
 *   @id - (INTEGER - REQUIRED): ID of the background job
 *   @data = {
 *     @alpha - (STRING - REQUIRED): Alpha argument description
 *     @beta - (BOOLEAN - OPTIONAL) [DEFAULT - 100]: Beta argument description
 *     @gamma - (NUMBER - OPTIONAL or REQUIRED): Cato argument description
 *     @delta - (STRING - REQUIRED): Delta argument description
 *     @zeta - (STRING - REQUIRED) [VALID - 'a', 'b']: Zeta argument description
 *   }
 * }
 *
 * Success: Return something
 *
 * !IMPORTANT: This is an important message
 * !NOTE: This is a note
 * TODO: This is a todo
 */
async function V1ExampleTask(job) {
  const schema = joi
    .object({
      alpha: joi
        .string()
        .trim()
        .min(1)
        .lowercase()
        .required()
        .error(new Error(req.__('ORGANIZATION_V1Example_Invalid_Argument[alpha]')))
    })
    .with('alpha', 'beta') // must come together
    .xor('beta', 'gamma') // one and not the other must exists
    .or('gamma', 'delta'); // at least one must exists

  // validate
  const { error, value } = schema.validate(job.data);
  if (error) return Promise.resolve(new Error(joiErrorsMessage(error)));
  job.data = value; // updated arguments with type conversion

  try {
    /***** DO WORK HERE *****/

    let finchUrl = 'https://api.tryfinch.com/employer/directory';

    let organizationId = job.data.organizationId;

    let hris_access_token = models.organization.findByPk(organizationId).hris_access_token;

    let resp = await got(finchUrl, {
      headers: { Authorization: `Bearer ${hris_access_token}` }
    });

    console.log(resp);

    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1ImportEmployees
