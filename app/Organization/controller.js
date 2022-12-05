/**
 * ORGANIZATION CONTROLLER
 *
 * Defines which Organization action methods are called based on the type of user role
 */

'use strict';

// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');
const { isEmployer } = require('../User/helper');

// actions
const actions = require('./actions');

module.exports = {
  V1Read,
  V1Create,
  V1Update,
  V1Query,
  V1UpdateEmail,
  V1Export
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
  let method = 'V1Create';

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
