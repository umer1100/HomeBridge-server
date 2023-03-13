/**
 * PROGRAM V1Create ACTION
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

// services

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
 * GET  /v1/programs/create
 * POST /v1/programs/create
 *
 * Must be logged in as EMPLOYER
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @isProgramActive - (BOOLEAN - REQUIRED): Whether the program is active
 *   @signupBonusValue - (BOOLEAN - REQUIRED): Value of the signup bonus
 *   @signupBonusActive - (BOOLEAN - REQUIRED): Whether the signup bonus is active
 *   @defaultContribution - (BOOLEAN - REQUIRED): Monthly default contribution
 *
 * }
 *
 * Success: Return something
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Create(req) {
  const schema = joi.object({
    isProgramActive: joi.boolean().default(true).required(),
    signupBonusValue: joi.number().min(1).required(),
    signupBonusActive: joi.boolean().default(true).required(),
    defaultContribution: joi.number().min(1).required()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    await models.programs.create({
      organizationId: req.user.organizationId,
      isProgramActive: req.args.isProgramActive,
      signupBonusActive: req.args.signupBonusActive,
      signupBonusValue: req.args.signupBonusValue,
      defaultContribution: req.args.defaultContribution
    });

    // return
    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Create
