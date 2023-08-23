/**
 * AGENT CONTROLLER
 *
 * Defines which Agent action methods are called based on the type of user role
 */

'use strict';

// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');

// actions
const actions = require('./actions');

module.exports = {
  V1Read,
  V1Query,
  V1Create
}

/**
 * Read Method
 *
 * /v1/agents/read
 *
 * Must be logged in
 * Roles: ['admin', 'user']
 */
async function V1Read(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.admin || req.user)
    method = `V1Read`;
  else
    return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}


/**
 * Query Method
 *
 * /v1/agents/query
 *
 * Must be logged in
 * Roles: ['admin', 'user']
 */
 async function V1Query(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.admin || req.user)
    method = `V1Query`;
  else
    return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}


/**
 * Create Method
 *
 * /v1/agents/create
 *
 * Must be logged in
 * Roles: ['admin']
 */
 async function V1Create(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.admin)
    method = `V1Create`;
  else
    return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}