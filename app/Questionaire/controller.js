/**
 * QUESTIONAIRE CONTROLLER
 *
 * Defines which Questionaire action methods are called based on the type of user role
 */

'use strict';

// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');

// actions
const actions = require('./actions');

module.exports = {
  V1Create,
  V1Read,
  V1Update
}

/**
 * Create Method
 *
 * /v1/questionaire/create
 *
 * Roles: ['user'] - EMPLOYEE
 */
async function V1Create(req, res, next) {
  let method = ''; // which action method to use

  if (req.user && req.user.roleType == 'EMPLOYEE') method = 'V1Create';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Create Method
 *
 * /v1/questionnaire/read
 *
 * Roles: ['user'] - EMPLOYEE
 */
async function V1Read(req, res, next) {
  let method = ''; // which action method to use

  if (req.user && req.user.roleType == 'EMPLOYEE') method = 'V1Read';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Create Method
 *
 * /v1/questionnaire/update
 *
 * Roles: ['user'] - EMPLOYEE
 */
async function V1Update(req, res, next) {
  let method = ''; // which action method to use

  if (req.user && req.user.roleType == 'EMPLOYEE') method = 'V1Update';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}
