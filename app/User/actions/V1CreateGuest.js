/**
 * User V1CreateGuest ACTION
 */

'use strict';

// ENV variables
const { WEB_HOSTNAME } = process.env;

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

// services
const emailService = require('../../../services/email');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { user } = require('../../../models');

// helpers
const { isValidTimezone } = require('../../../helpers/validate');
const { PASSWORD_LENGTH_MIN, PASSWORD_REGEX } = require('../../../helpers/constants');
const { randomString } = require('../../../helpers/logic');
const { join } = require('lodash');


// methods
module.exports = {
  V1CreateGuest
};

/**
 * Create an user
 *
 * GET  /v1/users/create
 * POST /v1/users/create
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *   @firstName - (STRING - REQUIRED): The first name of the new user
 *   @lastName - (STRING - REQUIRED): The last name of the new user
 *   @status - (STRING - REQUIRED): Status of the user
 *   @email - (STRING - REQUIRED): The email of the user,
 *   @phone - (STRING - REQUIRED): The phone of the user,
 *   @roleType - (STRING - REQUIRED): The role type of the user
 *   @timezone - (STRING - REQUIRED): The timezone of the user
 *   @locale - (STRING - REQUIRED): The language of the user
 *   @password1 - (STRING - REQUIRED): The unhashed password1 of the user
 *   @password2 - (STRING - REQUIRED): The unhashed password2 of the user
 *   @acceptedTerms - (BOOLEAN - REQUIRED): Whether terms is accepted or not
 * }
 *
 * Success: Return an user
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: USER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED
 *   400: USER_BAD_REQUEST_USER_ALREADY_EXISTS
 *   400: USER_BAD_REQUEST_INVALID_TIMEZONE
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1CreateGuest(req) {
  const schema = joi.object({
    firstName: joi.string().trim().min(1).required(),
    lastName: joi.string().trim().min(1).required(),
    status: joi.string(),
    email: joi.string().trim().lowercase().min(3).email().required(),
    phone: joi.string().trim(),
    roleType: joi.string().trim(),
    timezone: joi.string().min(1),
    locale: joi.string().min(1),
    password1: joi
      .string()
      .min(PASSWORD_LENGTH_MIN)
      .regex(PASSWORD_REGEX)
      .required()
      .error(new Error(req.__('USER[Invalid Password Format]'))),
    password2: joi
      .string()
      .min(PASSWORD_LENGTH_MIN)
      .regex(PASSWORD_REGEX)
      .required()
      .error(new Error(req.__('USER[Invalid Password Format]'))),
    acceptedTerms: joi.boolean().required(),
    kycIdType: joi.string().min(1).trim(),
    kycIdNumber: joi.string().min(1).trim(),
    addressline1: joi.string().trim().min(1),
    addressline2: joi.string().trim().min(1),
    city: joi.string().trim().min(1),
    state: joi.string().trim().min(1),
    country: joi.string().trim().min(1),
    zipcode: joi.string().trim().min(1),
    dateOfBirth: joi.date(),
    primaryGoal: joi.string().trim().min(1),
    goalTimeline: joi.string().trim().min(1),
    organizationId: joi.number().integer().min(1).required(),
  });
  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  req.args = value; // updated arguments with type conversion
  req.args.role = 'GUEST';

  const { timezone, locale, firstName, lastName, status, email, phone, role, acceptedTerms, addressline1, addressline2, city, state, country,
          zipcode, dateOfBirth, primaryGoal, goalTimeline, organizationId, password1, password2 } = req.args

  // check terms of service
  if (!acceptedTerms) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED));

  // check passwords
  if (password1 !== password2) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_PASSWORDS_NOT_EQUAL));
  const password = password1; // set password

  try {
    // check if user email already exists
    const duplicateUser = await user.findOne({
      where: {
        email: email
      }
    });

    // check of duplicate user user
    if (duplicateUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_USER_ALREADY_EXISTS));


    // create user
    const newUser = await user.create({
      timezone,
      locale,
      firstName,
      lastName,
      status,
      email,
      phone,
      password,
      acceptedTerms,
      addressline1,
      addressline2,
      city,
      state,
      country,
      zipcode,
      dateOfBirth,
      primaryGoal,
      goalTimeline,
      organizationId,
      roleType: role
    });
    // preparing for email confirmation
    const emailConfirmationToken = randomString();

    // update admin
    await user.update(
      {
        emailConfirmedToken: emailConfirmationToken,
      },
      {
        fields: ['emailConfirmedToken'], // only these fields
        where: {
          email: email
        }
      }
    );


    const emailConfirmLink = `${WEB_HOSTNAME}/ConfirmEmail?emailConfirmationToken=${emailConfirmationToken}`; // create URL using front end url

    const result = await emailService.send({
      from: emailService.emails.doNotReply.address,
      name: emailService.emails.doNotReply.name,
      subject: 'Email Confirmation',
      template: 'ConfirmEmail',
      tos: [email],
      ccs: null,
      bccs: null,
      args: {
        emailConfirmLink
      }
    });

    // grab user without sensitive data
    const returnUser = await user
      .findByPk(newUser.id, {
        attributes: {
          exclude: user.getSensitiveData() // remove sensitive data
        }
      })
      .catch(err => {
        newUser.destroy(); // destroy if error
        return Promise.reject(err);
      }); // END grab partner without sensitive data

    // return
    return Promise.resolve({
      status: 201,
      success: true,
      message: `An account confirmation email has been sent to ${email}. Please check your email.`,
      user: returnUser
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1CreateGuest
