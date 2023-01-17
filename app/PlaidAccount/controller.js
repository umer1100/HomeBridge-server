/**
 * PLAIDACCOUNT CONTROLLER
 *
 * Defines which Account action methods are called based on the type of user role
 */

'use strict';

// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');

// actions
const actions = require('./actions');

module.exports = {
  V1CreateAccessToken,
  V1CreateLinkToken
};

/**
 * CreateAccessToken Method
 *
 * /v1/plaidaccounts/createaccesstokens
 *
 * Must be logged in
 * Roles: ['user']
 */
async function V1CreateAccessToken(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.user) method = `V1CreateAccessToken`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}

async function V1CreateLinkToken(req, res, next) {
  let method = null;

  if (req.user) method = 'V1CreateLinkToken';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}
