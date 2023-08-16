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
  V1Create
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
