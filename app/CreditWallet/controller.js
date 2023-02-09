/**
 * CREDITWALLET CONTROLLER
 *
 * Defines which CreditWallet action methods are called based on the type of user role
 */

'use strict';

// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');
const { isEmployer } = require('../User/helper');

// actions
const actions = require('./actions');

module.exports = {
  V1Add,
  V1Read
};

/**
 * Add Method
 *
 * /v1/creditwallets/add
 *
 * Must be logged in
 * Roles: ['user']
 * roleType: ['employer']
 */
async function V1Add(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.user && isEmployer(req.user)) method = `V1Add`;
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
 * Read Method
 *
 * /v1/creditwallets/read
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
