/**
 * EMPLOYEESYNC V1Import TASK
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
const slugify = require('slugify'); // convert string to URL friendly string: https://www.npmjs.com/package/slugify
const sanitize = require('sanitize-filename'); // sanitize filename: https://www.npmjs.com/package/sanitize-filename
const passport = require('passport'); // handle authentication: http://www.passportjs.org/docs/
const currency = require('currency.js'); // handling currency operations (add, subtract, multiply) without JS precision issues: https://github.com/scurker/currency.js/
const accounting = require('accounting'); // handle outputing readable format for currency: http://openexchangerates.github.io/accounting.js/
const axios = require('axios');

// services
const email = require('../../../services/email');
const { SOCKET_ROOMS, SOCKET_EVENTS } = require('../../../services/socket');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers
const { getOffset, getOrdering, convertStringListToWhereStmt } = require('../../../helpers/cruqd');
const { randomString } = require('../../../helpers/logic');
const { LIST_INT_REGEX } = require('../../../helpers/constants');

// queues
const EmployeeSyncQueue = new Queue('EmployeeSyncQueue', REDIS_URL);

// methods
module.exports = {
  V1Import
};

/**
 * Method Description
 *
 * @job = {
 *   @id - (INTEGER - REQUIRED): ID of the background job
 *   @data = {
 *     @alpha - (STRING - REQUIRED): Alpha argument description
 *   }
 * }
 *
 * Success: Return something
 *
 * !IMPORTANT: This is an important message
 * !NOTE: This is a note
 * TODO: This is a todo
 */
async function V1Import(job) {
  const schema = joi
    .object({
      alpha: joi
        .string()
        .trim()
        .min(1)
        .lowercase()
        .required()
        .error(new Error(req.__('EMPLOYEESYNC_V1Example_Invalid_Argument[alpha]')))
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

    /**
       * -H 'Authorization: Bearer ddfd541f-c160-41f8-80cc-a0e355ba7dba' \
  -H 'Content-Type: application/json' \
  -H 'Finch-API-Version: 2020-09-17'
       */

    got(finchUrl, {
      headers: {
        Authorization: `Bearer ${hris_token}`
      }
    });

    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1ExampleTask
