/**
 * USER V1Update ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { questionaire } = require('../../../models');

// methods
module.exports = {
  V1Update
};

/**
 * Read and return an user
 *
 * GET  /v1/questionnaire/update
 * POST /v1/questionnaire/update
 *
 * Must be logged in
 * Roles: ['EMPLOYEE']
 *
 * req.params = {}
 * req.args = {
 *   @zipcode - (STRING - OPTIONAL)
 *   @profile - (STRING - OPTIONAL)
 *   @isWorkingWithAgent - (BOOLEAN - OPTIONAL)
 *   @preApprovedLoan - (BOOLEAN - OPTIONAL)
 *   @desiredBedrooms - (STRING - OPTIONAL)
 *   @timelineGoal - (STRING - OPTIONAL)
 *   @homeBudget - (STRING - OPTIONAL)
 * }
 *
 * Success: Return a user.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: QUESTIONNAIRE_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Update(req) {
  const schema = joi.object({
    id: joi.number().min(1).default(req.user.id).optional(),
    zipcode: joi.string().trim().min(1).optional(),
    profile: joi.string().trim().min(1).optional(),
    isWorkingWithAgent: joi.boolean().optional(),
    preApprovedLoan: joi.boolean().optional(),
    desiredBedrooms: joi.string().trim().min(1).optional(),
    timelineGoal: joi.string().trim().min(1).optional(),
    homeBudget: joi.string().trim().min(1).optional()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // find user
  const userQuestionnaire = await questionaire
    .findOne({
      where: {
        userId: req.args.id
      }
    })
    .catch(error => Promise.reject(error));

  // check if user exists
  if (!userQuestionnaire) return Promise.resolve(errorResponse(req, ERROR_CODES.QUESTIONNAIRE_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  await userQuestionnaire.update(req.args).catch(error => Promise.reject(error));

  return Promise.resolve({
    status: 200,
    success: true,
    data: userQuestionnaire.dataValues
  });
} // END V1Update
