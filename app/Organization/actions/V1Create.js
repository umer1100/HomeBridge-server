/**
 * Organization V1Create ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const { Op } = require('sequelize');

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { organization } = require('../../../models');

// helpers
const { isValidTimezone } = require('../../../helpers/validate');

// methods
module.exports = {
  V1Create
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
 *   @url - (STRING - REQUIRED): The url of the organization
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
async function V1Create(req) {
  const schema = joi.object({
    name: joi.string().trim().min(1).required(),
    active: joi.boolean(),
    email: joi.string().trim().lowercase().min(3).email(),
    phone: joi.string().trim(),
    timezone: joi.string().min(1),
    locale: joi.string().min(1),
    url: joi.string().trim().required(),
    status: joi.string().trim()
  });
  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  const { url, name, timezone, locale, active, email, phone, status } = req.args;
  try {
    // check if organization url already exists
    const duplicateOrganization = await organization.findOne({
      where: {
        [Op.or]: [
          {
            url: {
              [Op.eq]: url
            }
          },
          {
            name: {
              [Op.eq]: name
            }
          }
        ]
      }
    });

    // check if duplicate organization user
    if (duplicateOrganization) return Promise.resolve({ status: 201, success: true, organization: duplicateOrganization });

    // create organization
    const newOrganization = await organization.create({
      timezone,
      locale,
      name,
      active,
      email,
      phone,
      url,
      status
    });

    const returnOrganization = await organization.findByPk(newOrganization.id).catch(err => {
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
} // END V1Create
