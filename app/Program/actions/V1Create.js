/**
 * PROGRAM V1Create ACTION
 */

'use strict';

// ENV variables

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
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
 *   @signupBonusValue - (NUMBER - REQUIRED): Value of the signup bonus
 *   @signupBonusActive - (BOOLEAN - REQUIRED): Whether the signup bonus is active
 *   @defaultContribution - (NUMBER - REQUIRED): Monthly default contribution
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
    // signupBonusValue: joi.number().min(0).required(),
    // signupBonusActive: joi.boolean().default(true).required(),
    defaultContribution: joi.number().min(0).required()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    await models.programs.create({
      organizationId: req.user.organizationId,
      isProgramActive: req.args.isProgramActive,
      // signupBonusActive: req.args.signupBonusActive,
      // signupBonusValue: req.args.signupBonusValue,
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
