/**
 * ORGANIZATION V1GetUsers ACTION
 */

'use strict';

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const { user, organization, creditWallet } = require('../../../models');

// methods
module.exports = {
  V1GetUsers
};

/**
 * Read and return all users from an organization
 *
 * GET  /v1/organizations/users
 * POST /v1/organizations/users
 *
 * Must be logged in
 * Roles: ['user']
 *
 * req.params = {}
 * req.args = {
 *   @organizationId - (NUMBER - REQUIRED): The id of current users organization
 * }
 *
 * Success: Return users.
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: ORGANIZATION_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1GetUsers(req) {
  const schema = joi.object({
    organizationId: joi.number().min(1).default(req.user.organizationId)
  });

  // validate
  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  req.args = value;
  const { organizationId } = req.args

  if (!organizationId) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_HAVE_NO_ORGANIZATION));

  const findOrganizationUsers = await organization.findByPk(organizationId, {
    include: [{
      model: user,
      include: [{
        model: creditWallet,
        required: false
      }]
    }]
  }).catch(err => {
    Promise.reject(err)
  });

  // check if organization exists
  if (!findOrganizationUsers) return Promise.resolve(errorResponse(req, ERROR_CODES.ORGANIZATION_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  const organizationUsers = findOrganizationUsers.users.map(item => ({
    ...item.dataValues,
    creditWallets: item?.dataValues?.creditWallets.map(wallet => ({
      type: wallet?.dataValues?.walletType,
      value: wallet?.dataValues?.dollars
    }))
  }))

  return Promise.resolve({
    status: 200,
    success: true,
    data: organizationUsers
  });
} // END V1GetUsers
