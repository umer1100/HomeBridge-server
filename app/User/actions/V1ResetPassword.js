/**
 * USER V1ResetPassword ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const bcrypt = require('bcrypt');

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// user model
const { user } = require('../../../models');

// helpers
const { PASSWORD_LENGTH_MIN, PASSWORD_REGEX } = require('../../../helpers/constants');

// methods
module.exports = {
  V1ResetPassword
}

/**
 * Update password of user
 *
 * GET  /v1/users/reset-password
 * POST /v1/users/reset-password
 *
 * Must be logged out
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @password1 - (STRING - REQUIRED): password 1
 *   @password2 - (STRING - REQUIRED): password 2
 *   @passwordResetToken - (STRING - REQUIRED): passwordResetToken
 * }
 *
 * Success: Return a true.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: USER_BAD_REQUEST_INVALID_PASSWORD_RESET_TOKEN
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1ResetPassword(req) {
  const schema = joi.object({
    passwordResetToken: joi.string().trim().min(5).required().error(new Error(req.__('USER[Password Reset Token Is Required]'))),
    password1: joi.string().min(PASSWORD_LENGTH_MIN).regex(PASSWORD_REGEX).required().error(new Error(req.__('USER[Invalid Password Format]'))),
    password2: joi.string().min(PASSWORD_LENGTH_MIN).regex(PASSWORD_REGEX).required().error(new Error(req.__('USER[Invalid Password Format]')))
  });

  const { error } = schema.validate(req.args);
  const { passwordResetToken, password1, password2 } = req.args;

  if (error)
    return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  if (password1 !== password2)
    return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_PASSWORDS_NOT_EQUAL));

  try {
    const findUser = await user.findOne({
      where: {
        passwordResetToken: passwordResetToken
      }
    });

    if (!findUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_INVALID_PASSWORD_RESET_TOKEN));

    const newPassword = bcrypt.hashSync(password1, findUser.salt);

    await user.update({
      password: newPassword
    }, {
      fields: ['password'],
      where: {
        id: findUser.id
      }
    });

    return Promise.resolve({
      status: 200,
      success: true,
      message: 'Password successfully updated.'
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
