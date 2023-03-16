/**
 * USER V1ConfirmEmail ACTION
 */

'use strict';

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// models
const { user } = require('../../../models');

// methods
module.exports = {
  V1ConfirmEmail
};

/**
 * Confirm Email
 *
 * GET  /v1/users/confirm-email
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {}
 * req.query = {
 *   @emailConfirmationToken - (STRING - REQUIRED): The email confirmation token of the user
 *   @invitationEmail - (STRING - REQUIRED): To check email type either invitation or confirmation email
 * }
 *
 * Success: Return true
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1ConfirmEmail(req) {
  const schema = joi.object({
    emailConfirmationToken: joi.string().trim().min(5).required(),
    invitationEmail: joi.string(),
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  const { emailConfirmationToken, invitationEmail } = req.args

  // grab user with this email
  try {
    const findUser = await user.findOne({
      where: {
        emailConfirmedToken: emailConfirmationToken
      }
    });

    // if user cannot be found
    if (!findUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_INVALID_EMAIL_CONFIRMATION_TOKEN));

    // User [Role: Guest] should only receive confirmation email

    if (findUser?.roleType == 'GUEST' && invitationEmail) {
      return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
    }

    // User [Role: Not Guest] should only receive invitation email
    if (findUser?.roleType != 'GUEST' &&
       (invitationEmail?.toLowerCase() == 'false' || !invitationEmail)) {
      return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
    }

    // update emailConfirmation to true
    await user.update(
      {
        emailConfirmed: true,
        status: findUser.roleType != 'GUEST' && invitationEmail ? 'ONBOARDING': 'ACTIVE',
      },
      {
        fields: ['emailConfirmed', 'status'], // only these fields
        where: {
          id: findUser.id
        }
      }
    );

    // return success
    return Promise.resolve({
      status: 200,
      success: true,
      message: 'Email successfully confirmed.',
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1ConfirmEmail
