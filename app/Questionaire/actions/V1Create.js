/**
 * USER V1Create ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { user } = require('../../../models');

// methods
module.exports = {
  V1Create
};

/**
 * Update and return an user
 *
 * GET  /v1/questionaire/create
 * POST /v1/questionaire/create
 *
 * Must be logged in
 * Roles: ['User']
 *
 * req.params = {}
 * req.args = {
 *   @status - (STRING - REQUIRED): The user status
 *   @zipcode - (STRING - REQUIRED)
 *   @profile - (STRING - REQUIRED)
 *   @homeBudger - (STRING - REQUIRED)
 *   @isWorkingWithAgent - (STRING - REQUIRED)
 *   @preApprovedLoan - (STRING - REQUIRED)
 *   @desiredBedrooms - (STRING - REQUIRED)
 *   @timelineGoal - (STRING - REQUIRED)
 * }
 *
 * Success: Return a updated users.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Create(req) {
  const schema = joi.object({
    status: joi.string().required(),
    zipcode: joi.number().required(),
    profile: joi.string().required(),
    homeBudget: joi.string().required(),
    isWorkingWithAgent: joi.boolean().required(),
    preApprovedLoan: joi.boolean().required(),
    desiredBedrooms: joi.string().required(),
    timelineGoal: joi.string().required(),
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  req.args = value; // updated arguments with type conversion
  const { status, zipcode, profile, homeBudget, isWorkingWithAgent, preApprovedLoan, desiredBedrooms, timelineGoal } = req.args

  // find user
  const findUser = await user.findByPk(req.user.id, {
    attributes: {
      exclude: user.getSensitiveData() // remove sensitive data
    }
  }).catch(error => Promise.reject(error));

  // check if user exists
  if (!findUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  try {
    // update user
    await findUser.update({ status });

    // create new record in questioner
    await findUser.createQuestionaire({
      zipcode,
      profile,
      homeBudget,
      isWorkingWithAgent,
      preApprovedLoan,
      desiredBedrooms,
      timelineGoal
    });

    return Promise.resolve({
      status: 200,
      success: true,
      data: findUser.dataValues
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Create
