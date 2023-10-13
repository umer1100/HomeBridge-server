/**
 * USER V1EmployerSignUpOAuth ACTION
 */

'use strict';

const { WEB_HOSTNAME } = process.env;

const joi = require('@hapi/joi');
const models = require('../../../models.js');
const conn = require('../../../database/index.js');
const emailService = require('../../../services/email');
const { ROLE, STATUS, MESSAGE } = require('../../../helpers/constants.js');
const { randomString } = require('../../../helpers/logic');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error.js');
const { getUserInfo } = require('../../../services/oauth.js');

module.exports = {
  V1EmployerSignUpOAuth
};

/**
 * Sign Up as an employer
 *
 * POST /v1/users/employer/signUp/oauth
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *  @code - (STRING - REQUIRED): The first name of the employer
 * }
 *
 * Success: returns user object
 * Errors:
 *   500: INTERNAL_SERVER_ERROR
 */

async function V1EmployerSignUpOAuth(req, res) {
  const joiObject = joi.object({
    code: joi.string().trim().min(1).required()
  });

  const { error, value } = joiObject.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  req.args = value;
  const { code } = req.args;

  try {
    const userResponse = await getUserInfo(code);
    const { given_name, family_name, email } = userResponse.data;

    const duplicateUser = await models.user.findOne({
      where: {
        email
      }
    });
    if (duplicateUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_USER_ALREADY_EXISTS));

    const password = randomString({ len: 10 });
    const emailConfirmationToken = randomString();

    if (userResponse && userResponse?.data?.verified_email) {
      const transaction = await conn.transaction();

      const newUser = await models.user.create(
        {
          email,
          firstName: given_name,
          lastName: family_name,
          roleType: ROLE.EMPLOYER,
          status: STATUS.ONBOARDING,
          password: password,
          emailConfirmedToken: emailConfirmationToken,
          source: 'SSO'
        },
        { transaction }
      );

      const emailConfirmLink = `${WEB_HOSTNAME}/ConfirmEmail?emailConfirmationToken=${emailConfirmationToken}`;

      // sending email with invitation token and password
      await emailService
        .send({
          from: emailService.emails.doNotReply.address,
          name: emailService.emails.doNotReply.name,
          subject: 'Welcome to Ownerific',
          template: 'InvitationEmail',
          tos: [newUser.email],
          ccs: null,
          bccs: null,
          args: {
            emailConfirmLink,
            password,
            firstName: newUser.firstName,
            lastName: newUser.lastName
          }
        })
        .catch(err => {
          newUser.destroy(); // destroy if error
          return Promise.reject(err);
        });

      await transaction.commit();
      return Promise.resolve({
        status: 201,
        success: true,
        message: MESSAGE.ACCOUNT_CREATED
      });
    } else {
      return Promise.resolve({
        status: 404,
        success: false,
        message: MESSAGE.ACCOUNT_CREATION_FAILED
      });
    }
  } catch (error) {
    console.error('Token exchange failed: ', error.response.data);
    return Promise.reject(error);
  }
} // END V1EmployerSignUpOAuth
