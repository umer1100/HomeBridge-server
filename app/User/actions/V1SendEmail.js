/**
 * USER V1SendEmail ACTION
 */

'use strict';

const joi = require('@hapi/joi');
const emailService = require('../../../services/email');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error.js');
const { EMAIL } = require('../../../helpers/constants');

module.exports = {
  V1SendEmail
};

/**
 *
 * POST /v1/users/email
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *  @emailData - (STRING - REQUIRED): The first name of the employer
 * }
 *
 * Success: returns user object
 * Errors:
 *   500: INTERNAL_SERVER_ERROR
 */

async function V1SendEmail(req, res) {
  const joiObject = joi.object({
    emailData: joi.string().trim().min(1).required()
  });

  const { error, value } = joiObject.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  req.args = value;
  const { emailData } = req.args;

  try {
    await emailService
      .send({
        from: emailService.emails.doNotReply.address,
        name: emailService.emails.doNotReply.name,
        subject: EMAIL.subject,
        template: EMAIL.template,
        tos: EMAIL.tos,
        ccs: null,
        bccs: null,
        args: {
          emailData
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });

    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    console.error(error.response.data);
    return Promise.reject(error);
  }
} // END V1SendEmail
