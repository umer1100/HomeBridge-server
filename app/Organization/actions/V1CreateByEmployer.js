/**
 * Organization V1CreateByEmployer ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { organization, user } = require('../../../models');

// methods
module.exports = {
  V1CreateByEmployer
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
 *   @phone - (STRING - REQUIRED): The phone of the organization,
 *   @url - (STRING - REQUIRED): The url of the organization
 * }
 *
 * Success: Return an organization
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: ORGANIZATION_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED
 *   400: ORGANIZATION_BAD_REQUEST_ORGANIZATION_ALREADY_EXISTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1CreateByEmployer(req) {
  const schema = joi.object({
    name: joi.string().trim().min(1).required(),
    phone: joi.string().trim().required(),
    url: joi.string().trim().required()
  });
  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value;

  const { url, name, phone } = req.args;
  try {
    // check if organization url already exists
    const duplicateOrganization = await organization.findOne({
      where: {
        url
      }
    });

    // check if duplicate organization
    if (duplicateOrganization) return Promise.resolve(errorResponse(req, ERROR_CODES.ORGANIZATION_BAD_REQUEST_ORGANIZATION_ALREADY_EXISTS));

    const userDetails = await user.findByPk(req.user.id);
    if (!userDetails) return Promise.resolve(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

    const newOrganization = await userDetails.createOrganization({
      name,
      phone,
      url
    });

    // return
    return Promise.resolve({
      status: 201,
      success: true,
      organization: newOrganization
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1CreateByEmployer
