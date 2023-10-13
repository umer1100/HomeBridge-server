/**
 * ORGANIZATION CONTROLLER
 *
 * Defines which Organization action methods are called based on the type of user role
 */

'use strict';

const { isEmployer } = require('../../helpers/validate');
// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');

// actions
const actions = require('./actions');

module.exports = {
  V1Read,
  V1Create,
  V1Update,
  V1Query,
  V1UpdateEmail,
  V1Export,
  V1UpdateHrisAccessToken,
  V1GetUsers,
  V1GetAverageOwnerificCredit,
  V1GetAverageHomePrice,
  V1GetTotalOwnerificCredit,
  V1GetCompanyDetailsFromFinch,
  V1GetUsersPlaidAccountDetails
};

/**
 * Read and return an organization
 *
 * /v1/organizations/read
 *
 * Must be logged in
 * Roles: ['organization', 'admin']
 */
async function V1Read(req, res, next) {
  let method = null; // which action method to use
  // which method to call
  if (req.organization) method = `V1ReadByOrganization`;
  else if (req.admin) method = `V1ReadByAdmin`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Create an organization
 *
 * /v1/organizations/create
 *
 * Must be logged in
 * Roles: ['admin']
 */
async function V1Create(req, res, next) {
  let method = null;

  if (req.user && isEmployer(req.user)) method = 'V1CreateByEmployer'
  else method = 'V1Create'
  
  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Update and return updated organization
 *
 * /v1/organizations/update
 *
 * Must be logged in
 * Roles: ['organization']
 */
async function V1Update(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.organization) method = `V1Update`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Query and return organizations
 *
 * /v1/organizations/query
 *
 * Must be logged in
 * Roles: ['organization']
 */
async function V1Query(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.organization) method = `V1Query`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Update email of an organization
 *
 * /v1/organizations/updateemail
 *
 * Must be logged in
 * Roles: ['organization']
 */
async function V1UpdateEmail(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.organization) method = `V1UpdateEmail`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Export an organization
 *
 * /v1/organizations/export
 *
 * Must be logged in
 * Roles: ['organization']
 */
async function V1Export(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.organization) method = `V1Export`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Exchange Finch code with accessToken and update organization HrisAccessToken
 *
 * /v1/organizations/store-hris-access-token
 *
 * Employer must be logged in
 */
async function V1UpdateHrisAccessToken(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.user && req.user.roleType == 'EMPLOYER') method = 'V1UpdateHrisAccessToken';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

async function V1GetUsers(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.user) method = 'V1GetUsers';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status).json(result);
}


/**
 * Grabs the average ownerific credit for all employees in an organization
 *
 * /v1/organizations/get-average-ownerific-credit
 *
 * Must be logged in
 */
async function V1GetAverageOwnerificCredit(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.user) method = 'V1GetAverageOwnerificCredit';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status).json(result);
}


/**
 * Grabs the average home price for all employees in an organization
 *
 * /v1/organizations/get-average-home-price
 *
 * Employer must be logged in
 */
async function V1GetAverageHomePrice(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.user && req.user.roleType == 'EMPLOYER') method = 'V1GetAverageHomePrice';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status).json(result);
}


/**
 * Grabs the total ownerific credit for all employees in an organization
 *
 * /v1/organizations/get-total-ownerific-credit
 *
 * Employer must be logged in
 */
 async function V1GetTotalOwnerificCredit(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.user && req.user.roleType == 'EMPLOYER') method = 'V1GetTotalOwnerificCredit';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status).json(result);
}


async function V1GetCompanyDetailsFromFinch(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.user) method = 'V1GetCompanyDetailsFromFinch';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status).json(result);
}

/**
 * Query and return organization and all associated users with their plaid accounts
 *
 * /v1/organization/users-plaid-accounts
 *
 * Must be logged in
 */

async function V1GetUsersPlaidAccountDetails(req, res, next) {
  let method = null;

  if (req.user) method = 'V1GetUsersPlaidAccountDetails';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status).json(result);
}
