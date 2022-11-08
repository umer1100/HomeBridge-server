/**
 * Organization V1Create ACTION
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
 * Create an organization
 *
 * GET  /v1/organizations/create
 * POST /v1/organizations/create
 *
 * Must be logged in
 * Roles: ['admin']
 *
 * req.params = {}
 * req.args = {
 *   @name - (STRING - REQUIRED): The name of the new organization
 *   @active - (BOOLEAN - REQUIRED): Whether organization is active or not
 *   @email - (STRING - REQUIRED): The email of the organization,
 *   @phone - (STRING - REQUIRED): The phone of the organization,
 *   @timezone - (STRING - REQUIRED): The timezone of the organization,
 *   @locale - (STRING - REQUIRED): The language of the user
 * }
 *
 * Success: Return an organization
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: ORGANIZATION_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED
 *   400: ORGANIZATION_BAD_REQUEST_ORGANIZATION_ALREADY_EXISTS
 *   400: ORGANIZATION_BAD_REQUEST_INVALID_TIMEZONE
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
    locale: joi.string().min(1)
  });
  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    // check if organization email already exists
    const duplicateOrganization = await models.organization.findOne({
      where: {
        email: req.args.email
      }
    });

    // check of duplicate organization user
    if (duplicateOrganization) return Promise.resolve(errorResponse(req, ERROR_CODES.ORGANIZATION_BAD_REQUEST_ORGANIZATION_ALREADY_EXISTS));

    // check timezone
    if (!isValidTimezone(req.args.timezone)) return Promise.resolve(errorResponse(req, ERROR_CODES.ORGANIZATION_BAD_REQUEST_INVALID_TIMEZONE));
    // create organization
    const newOrganization = await models.organization.create({
      timezone: req.args.timezone,
      locale: req.args.locale,
      name: req.args.name,
      active: req.args.active,
      email: req.args.email,
      phone: req.args.phone
    });

    const returnOrganization = await models.organization.findByPk(newOrganization.id).catch(err => {
      newOrganization.destroy(); // destroy if error
      return Promise.reject(err);
    }); // END grab organization

    // return
    return Promise.resolve({
      status: 201,
      success: true,
      organization: returnOrganization
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1CreateByAdmin
