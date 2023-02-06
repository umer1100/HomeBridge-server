/**
 * ORGANIZATION V1UpdateHrisAccessToken ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const axios = require('axios');

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// ENV variables
const { FINCH_CLIENT_ID, FINCH_CLIENT_SECRET } = process.env;

// models
const { organization } = require('../../../models');

// methods
module.exports = {
  V1UpdateHrisAccessToken
};

const FINCH_BASE_URI = 'https://api.tryfinch.com';

/**
 * Get an access token using finch api: https://api.tryfinch.com/auth/token
 *
 * GET  /v1/organizations/store-hris-access-token
 * POST /v1/organizations/store-hris-access-token
 *
 * Must be logged in
 *
 * req.params = {}
 * req.args = {
 *   @code - (STRING - REQUIRED): The finch temporary code (we get the code when user successfully logged in HRIS through finch SDK)
 * }
 *
 * Success: Return a organization.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1UpdateHrisAccessToken(req) {
  const schema = joi.object({
    code: joi.string().required()
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  // find organization
  const findOrganization = await organization.findByPk(req.user.organizationId).catch(err => Promise.reject(error));

  // check if organization exists
  if (!findOrganization) return Promise.resolve(errorResponse(req, ERROR_CODES.ORGANIZATION_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  // exchange finch temporary code with permanent access token
  let accessToken = await axios
    .post(`${FINCH_BASE_URI}/auth/token`, req.args, {
      auth: {
        username: FINCH_CLIENT_ID,
        password: FINCH_CLIENT_SECRET
      }
    })
    .then(async response => {
      return response.data.access_token;
    })
    .catch(error => {
      return Promise.reject(error);
    });

  try {
    // update organization
    // await findOrganization.update({ hrisAccessToken: accessToken });

    return Promise.resolve({
      status: 200,
      success: true,
      organization: findOrganization.dataValues
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1UpdateHrisAccessToken
