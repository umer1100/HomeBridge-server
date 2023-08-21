/**
 * ORGANIZATION V1GetAverageOwnerificCredit ACTION
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
  V1GetAverageOwnerificCredit
 };

 /**
  * Get the average ownerific credit for all users in an organization
  *
  * GET  /v1/organizations/get-average-ownerific-credit
  * POST /v1/organizations/get-average-ownerific-credit
  *
  * Must be logged in
  * Roles: ['user']
  *
  * req.params = {}
  * req.args = {
  *   @organizationId - (NUMBER - REQUIRED): The id of current users organization
  * }
  *
  * Success: Return average ownerific credit of all users
  * Errors:
  *   400: BAD_REQUEST_INVALID_ARGUMENTS
  *   400: ORGANIZATION_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
  *   400: USER_BAD_REQUEST_HAVE_NO_ORGANIZATION
  *   401: UNAUTHORIZED
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1GetAverageOwnerificCredit(req) {
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
      }]
    }]
  }).catch(err => Promise.reject(error));

  // check if organization exists
  if (!findOrganizationUsers) return Promise.resolve(errorResponse(req, ERROR_CODES.ORGANIZATION_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

  let totalCredit = 0;
  findOrganizationUsers.users.forEach(async user => {
    if (user?.roleType == 'EMPLOYEE') {
      user?.creditWallets?.forEach(wallet => {
        if (wallet?.walletType == 'PLATFORM'){
          totalCredit += Number(wallet?.dataValues?.dollars);
        }
      })
    }
  });

  return Promise.resolve({
    status: 200,
    success: true,
    data: (totalCredit / findOrganizationUsers.users?.filter(user => user?.roleType == 'EMPLOYEE').length).toFixed(2)
  });
 } // END V1GetAverageOwnerificCredit
