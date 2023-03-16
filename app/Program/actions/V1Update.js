/**
 * PROGRAM V1Update ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { program } = require('../../../models');

// methods
module.exports = {
  V1Update
};

/**
 * Update and return a program
 *
 * GET  /v1/program/Update
 * POST /v1/program/Update
 *
 * Must be logged in
 * Roles: ['User']
 *
 * req.params = {}
 * req.args = {
 *   @id - (NUMBER - REQUIRED): The id of the program
 *   @isProgramActive - (BOOLEAN - OPTIONAL): Whether the program is active
 *   @signupBonusValue - (NUMBER - OPTIONAL): Value of the signup bonus
 *   @signupBonusActive - (BOOLEAN - OPTIONAL): Whether the signup bonus is active
 *   @defaultContribution - (NUMBER - OPTIONAL): Monthly default contribution
 * }
 *
 * Success: Return an updated program.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Update(req) {
  const schema = joi.object({
    id: joi.number().min(1).required(),
    isProgramActive: joi.boolean().optional(),
    signupBonusValue: joi.number().min(0).optional(),
    signupBonusActive: joi.boolean().optional(),
    defaultContribution: joi.number().min(0).optional()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // find program
  const findProgram = await program.findByPk(req.args.id).catch(err => Promise.reject(error));

  // check if program exists
  if (!findProgram) return Promise.resolve(errorResponse(req, ERROR_CODES.PROGRAM_BAD_REQUEST_PROGRAM_DOES_NOT_EXIST));

  try {
    // update program
    await findProgram.update(req.args);

    return Promise.resolve({
      status: 200,
      success: true,
      program: findProgram.dataValues
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Update
