/**
 * USER V1UpdateBulkUsers ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// methods
module.exports = {
  V1UpdateBulkUsers
};

/**
 * Update bulk users
 *
 * GET  /v1/users/update-bulk-users
 * POST /v1/users/update-bulk-users
 *
 * Must be logged in
 * Roles: ['User']
 *
 * req.params = {}
 * req.args = {
 *   @users - (ARRAY - Required): The user to update
 *   @payload - (Object - Required): fields to update
 * }
 *
 * Success: Return a updated users.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1UpdateBulkUsers(req) {
  const schema = joi.object({
    users: joi.array().required(),
    payload: joi.object().keys({
      action: joi.string().valid('UNPAUSE', 'PAUSE').required()
    }).required().error(new Error('Invalid payload'))
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  let { users, payload } = req.args;

  // user cannot update an employer
  const findEmployer = users.find((user) => user.roleType == 'EMPLOYER');
  if (findEmployer) {
    return Promise.resolve({ success: false, status: 400, message: 'Invalid request, cannot update EMPLOYER.' });
  }

  if (payload.action === 'UNPAUSE') {
    // all users must be paused
    const findUnpauseUser = users.find(user => user.status !== 'PAUSE');
    if (findUnpauseUser) {
      return Promise.resolve({ success: false, status: 400, message: 'Invalid action, users must be paused.' });
    }
  } else if (payload.action === 'PAUSE') {
    // users should not be paused
    const findPauseUser = users.find(user => user.status === 'PAUSE');
    if (findPauseUser) {
      return Promise.resolve({ success: false, status: 400, message: 'Invalid action, user already paused.' });
    }
  }

  try {
    await Promise.all(users.map(async (user) => {
      const userData = await models.user.findOne({
        where: {
          email: user.email,
        }
      });

      if (userData) {
        const status = payload.action === 'PAUSE' ? 'PAUSE' : (userData.previousStatus || userData.status);
        await userData.update({ status })
      }
    }));

    return Promise.resolve({
      status: 200,
      success: true,
    });
  } catch (error) {
    return Promise.reject(error);
  }

} // END V1UpdateBulkUsers
