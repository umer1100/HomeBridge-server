/**
 * ORGANIZATION V1GetCompanyDetailsFromFinch ACTION
 */

 'use strict';

 // services
 const { getCompany } = require('../../../services/finch');
 const { ERROR_CODES, errorResponse } = require('../../../services/error');

 // models
 const { organization } = require('../../../models')

 // methods
 module.exports = {
  V1GetCompanyDetailsFromFinch
 };

 /**
  * return company details from finch
  *
  * GET  /v1/hris/company
  * POST /v1/hris/company
  *
  * Must be logged in
  * Roles: ['user']
  *
  * req.params = {}
  * req.args = {}
  *
  * Success: Return users.
  * Errors:
  *   400: USER_BAD_REQUEST_HAVE_NO_ORGANIZATION
  *   404: ORGANIZATION_BAD_REQUEST_DOES_NOT_INTEGRATED_WITH_FINCH
  *   401: UNAUTHORIZED
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1GetCompanyDetailsFromFinch(req) {
  const { organizationId } = req.user

  if (!organizationId) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_HAVE_NO_ORGANIZATION));

  let findOrganization = await organization.findByPk(organizationId);
  const { hrisAccessToken } = findOrganization

  if (!hrisAccessToken) return Promise.resolve(errorResponse(req, ERROR_CODES.ORGANIZATION_BAD_REQUEST_DOES_NOT_INTEGRATED_WITH_FINCH));

  try {
    let resp = await getCompany(hrisAccessToken)
    return Promise.resolve({
      status: 200,
      success: true,
      data: resp
    });
  } catch (error) {
    return Promise.reject(error);
  }
 } // END V1Read
