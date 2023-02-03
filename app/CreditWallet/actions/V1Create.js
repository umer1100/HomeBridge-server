/**
 * CREDITWALLET V1Create ACTION
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

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers

// queues

// methods
module.exports = {
  V1Create
};

/**
 * Method Description
 *
 * GET  /v1/creditwallets/create
 * POST /v1/creditwallets/create
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @alpha - (STRING - REQUIRED): Alpha argument description
 *   @beta - (BOOLEAN - OPTIONAL) [DEFAULT - 100]: Beta argument description
 *   @gamma - (NUMBER - OPTIONAL or REQUIRED): Cato argument description
 *   @delta - (STRING - REQUIRED): Delta argument description
 *   @zeta - (STRING - REQUIRED) [VALID - 'a', 'b']: Zeta argument description
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
async function V1Create(req) {
  const schema = joi.object({
    alpha: joi
      .string()
      .trim()
      .min(1)
      .lowercase()
      .required()
      .error(new Error(req.__('CREDITWALLET_V1Example_Invalid_Argument[alpha]')))
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    let wallet = models.creditWallet.create({ userId: req.user.id });

    // return
    return Promise.resolve({
      status: 200,
      success: true,
      jobId: job.id,
      data: wallet
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Example
