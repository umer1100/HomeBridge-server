/**
 * TRANSACTION CONTROLLER
 *
 * Defines which Transaction action methods are called based on the type of user role
 */

'use strict';

// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');

// actions
const actions = require('./actions');

module.exports = {
  V1Create,
  V1Read,
  V1Sync,
};

/**
 * V1Create Method
 *
 * /v1/transactions/create
 *
 * Must be logged in
 * Roles: ['user']
 */
async function V1Create(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.user) method = `V1Create`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * V1Read Method
 *
 * /v1/transactions/read
 *
 * Must be logged in
 * Roles: ['user']
 */
async function V1Read(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.user) method = `V1Read`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}


/**
 * V1Sync
 *
 * /v1/transactions/sync
 *
 * Must be logged in
 * Roles: ['user']
 */
async function V1Sync(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.user) method = 'V1Sync';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}