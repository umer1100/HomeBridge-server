/**
 * User V1CreateByOrganizationalUser ACTION
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers
const { isValidTimezone, isValidRoleAction } = require('../../../helpers/validate');
const { PASSWORD_LENGTH_MIN, PASSWORD_REGEX } = require('../../../helpers/constants');
const { join } = require('lodash');
const { ROLES } = require('../../../helpers/constants');

// methods
module.exports = {
  V1CreateByOrganizationalUser
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
async function V1CreateByOrganizationalUser(req) {
  const schema = joi.object({
    firstName: joi.string().trim().min(1).required(),
    lastName: joi.string().trim().min(1).required(),
    status: joi.string().required(),
    email: joi.string().trim().lowercase().min(3).email().required(),
    phone: joi.string().trim(),
    roleType: joi.string().trim(),
    organizationId: joi.number().integer().min(1).required(),
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
    dateOfBirth: joi.date()
  });
  // validate
  const { error, value } = schema.validate(req.args);

  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // check passwords
  if (req.args.password1 !== req.args.password2) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_PASSWORDS_NOT_EQUAL));
  req.args.password = req.args.password1; // set password

  try {
    // check if user email already exists
    const duplicateUser = await models.user.findOne({
      where: {
        email: req.args.email
      }
    });

    // check of duplicate user user
    if (duplicateUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_USER_ALREADY_EXISTS));

    // check timezone
    if (!isValidTimezone(req.args.timezone)) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_INVALID_TIMEZONE));

    // validate roleType
    if (!isValidRoleAction(req.user.roleType, req.args.roleType)) return Promise.resolve(errorResponse(req, ERROR_CODES.UNAUTHORIZED));
    // validate organizationId
    // if (req.user.organizationId !== req.args.organizationId) return Promise.resolve(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

    // create user
    const newUser = await models.user.create({
      timezone: req.args.timezone,
      locale: req.args.locale,
      firstName: req.args.firstName,
      lastName: req.args.lastName,
      status: req.args.status,
      email: req.args.email,
      phone: req.args.phone,
      roleType: req.args.roleType,
      organizationId: req.args.organizationId,
      password: req.args.password,
      acceptedTerms: req.args.acceptedTerms,
      addressline1: req.args.addressline1,
      addressline2: req.args.addressline2,
      city: req.args.city,
      state: req.args.state,
      country: req.args.country,
      zipcode: req.args.zipcode,
      dateOfBirth: req.args.dateOfBirth
    });

    // grab user without sensitive data
    const returnUser = await models.user
      .findByPk(newUser.id, {
        attributes: {
          exclude: models.user.getSensitiveData() // remove sensitive data
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
      user: returnUser
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Create
