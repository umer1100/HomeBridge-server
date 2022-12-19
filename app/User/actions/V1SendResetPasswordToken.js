/**
 * USER V1SendResetPasswordToken ACTION
 */

'use strict';

// ENV variables
const { NODE_ENV, WEB_HOSTNAME } = process.env;

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

// services
const emailService = require('../../../services/email');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { user } = require('../../../models');

// helpers
const { randomString } = require('../../../helpers/logic');

// methods
module.exports = {
  V1SendResetPasswordToken
};

/**
 * Send Reset Password Token
 *
 * GET  /v1/users/send-reset-password-token
 * POST /v1/users/send-reset-password-token
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *   @email - (STRING - REQUIRED): The email of the user
 * }
 *
 * Success: Return true
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1SendResetPasswordToken(req) {
  const schema = joi.object({
    email: joi.string().trim().lowercase().min(3).email().required()
  });

  // validate
  const { error } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  try {
    const findUser = await user.findOne({
      where: {
        email: req.args.email
      }
    });

    if (!findUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

    const passwordResetToken = randomString();
    const passwordResetExpire = moment.tz('UTC').add(6, 'hours');

    await user.update(
      {
        passwordResetToken: passwordResetToken,
        passwordResetExpire: passwordResetExpire
      },
      {
        fields: ['passwordResetToken', 'passwordResetExpire'],
        where: {
          email: req.args.email
        }
      }
    );

    const resetLink = `${WEB_HOSTNAME}/ResetPassword?passwordResetToken=${passwordResetToken}`;

    await emailService.send({
      from: emailService.emails.doNotReply.address,
      name: emailService.emails.doNotReply.name,
      subject: 'Please use this link to update your password',
      template: 'UserResetPassword',
      tos: [req.args.email],
      ccs: null,
      bccs: null,
      args: {
        resetPasswordConfirmationLink: resetLink,
        expires: '6 hours'
      }
    });

    return Promise.resolve({
      status: 200,
      success: true,
      message: 'An email has been sent to ' + req.args.email + '. Please check your email.',
      resetLink: NODE_ENV === 'test' ? resetLink : null // only return reset link in dev and test env for testing purposes
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
