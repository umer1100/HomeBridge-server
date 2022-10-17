/**
 * Employer V1Create ACTION
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
const { isValidTimezone } = require('../../../helpers/validate');
const { PASSWORD_LENGTH_MIN, PASSWORD_REGEX } = require('../../../helpers/constants');

// methods
module.exports = {
  V1CreateByAdmin
};

/**
 * Create an employer
 *
 * GET  /v1/employers/create
 * POST /v1/employers/create
 *
 * Must be logged in
 * Roles: ['admin']
 *
 * req.params = {}
 * req.args = {
 *   @name - (STRING - REQUIRED): The name of the new employer
 *   @active - (BOOLEAN - REQUIRED): Whether employer is active or not
 *   @email - (STRING - REQUIRED): The email of the employer,
 *   @phone - (STRING - REQUIRED): The phone of the employer,
 *   @timezone - (STRING - REQUIRED): The timezone of the employer,
 *   @locale - (STRING - REQUIRED): The language of the user
 *   @password1 - (STRING - REQUIRED): The unhashed password1 of the employer
 *   @password2 - (STRING - REQUIRED): The unhashed password2 of the employer
 *   @acceptedTerms - (BOOLEAN - REQUIRED): Whether terms is accepted or not
 * }
 *
 * Success: Return an employer
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: EMPLOYER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED
 *   400: EMPLOYER_BAD_REQUEST_EMPLOYER_ALREADY_EXISTS
 *   400: EMPLOYER_BAD_REQUEST_INVALID_TIMEZONE
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1CreateByAdmin(req) {
  const schema = joi.object({
    name: joi.string().trim().min(1).required(),
    active: joi.boolean().required(),
    email: joi.string().trim().lowercase().min(3).email().required(),
    phone: joi.string().trim(),
    timezone: joi.string().min(1),
    locale: joi.string().min(1),
    password1: joi
      .string()
      .min(PASSWORD_LENGTH_MIN)
      .regex(PASSWORD_REGEX)
      .required()
      .error(new Error(req.__('EMPLOYER[Invalid Password Format]'))),
    password2: joi
      .string()
      .min(PASSWORD_LENGTH_MIN)
      .regex(PASSWORD_REGEX)
      .required()
      .error(new Error(req.__('EMPLOYER[Invalid Password Format]'))),
    acceptedTerms: joi.boolean().required()
  });
  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // check passwords
  if (req.args.password1 !== req.args.password2) return Promise.resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_PASSWORDS_NOT_EQUAL));
  req.args.password = req.args.password1; // set password

  // check terms of service
  if (!req.args.acceptedTerms) return Promise.resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED));

  try {
    // check if employer email already exists
    const duplicateEmployer = await models.employer.findOne({
      where: {
        email: req.args.email
      }
    });

    // check of duplicate employer user
    if (duplicateEmployer) return Promise.resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_EMPLOYER_ALREADY_EXISTS));

    // check timezone
    if (!isValidTimezone(req.args.timezone)) return Promise.resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_INVALID_TIMEZONE));
    // create employer
    const newEmployer = await models.employer.create({
      timezone: req.args.timezone,
      locale: req.args.locale,
      name: req.args.name,
      active: req.args.active,
      email: req.args.email,
      phone: req.args.phone,
      password: req.args.password,
      acceptedTerms: req.args.acceptedTerms
    });

    // grab employer without sensitive data
    const returnEmployer = await models.employer
      .findByPk(newEmployer.id, {
        attributes: {
          exclude: models.employer.getSensitiveData() // remove sensitive data
        }
      })
      .catch(err => {
        newEmployer.destroy(); // destroy if error
        return Promise.reject(err);
      }); // END grab partner without sensitive data

    // return
    return Promise.resolve({
      status: 201,
      success: true,
      employer: returnEmployer
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1CreateByAdmin
