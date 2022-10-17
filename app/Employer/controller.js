/**
 * EMPLOYER CONTROLLER
 *
 * Defines which Employer action methods are called based on the type of user role
 */

'use strict';

// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');

// actions
const actions = require('./actions');

module.exports = {
  V1Login,
  V1Read,
  V1Create,
  V1Update,
  V1Query,
  V1UpdatePassword,
  V1ResetPassword,
  V1ConfirmPassword,
  V1UpdateEmail,
  V1Export
};

/**
 * Login as employer
 *
 * /v1/employers/login
 *
 * Must be logged out
 * Roles: []
 */
async function V1Login(req, res, next) {
  let method = 'V1Login';

  // call correct method
  // login has to include the "res" object for passport.authenticate
  const result = await actions[method](req, res).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Read and return an employer
 *
 * /v1/employers/read
 *
 * Must be logged in
 * Roles: ['employer', 'admin']
 */
async function V1Read(req, res, next) {
  let method = null; // which action method to use
  // which method to call
  if (req.employer) method = `V1ReadByEmployer`;
  else if (req.admin) method = `V1ReadByAdmin`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Create an employer
 *
 * /v1/employers/create
 *
 * Must be logged in
 * Roles: ['admin']
 */
async function V1Create(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.admin) method = `V1CreateByAdmin`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Update and return updated employer
 *
 * /v1/employers/update
 *
 * Must be logged in
 * Roles: ['employer']
 */
async function V1Update(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.employer) method = `V1Update`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Query and return employers
 *
 * /v1/employers/query
 *
 * Must be logged in
 * Roles: ['employer']
 */
async function V1Query(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.employer) method = `V1Query`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Update password of an employer
 *
 * /v1/employers/updatepassword
 *
 * Must be logged in
 * Roles: ['employer']
 */
async function V1UpdatePassword(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.employer) method = `V1UpdatePassword`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Reset password of an employer
 *
 * /v1/employers/resetpassword
 *
 * Must be logged out
 * Roles: []
 */
async function V1ResetPassword(req, res, next) {
  let method = 'V1ResetPassword';

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Confirm new password after resetting
 *
 * /v1/employers/confirmpassword
 *
 * Can be logged in or logged out
 * Roles: []
 */
async function V1ConfirmPassword(req, res, next) {
  let method = 'V1ConfirmPassword';

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Update email of an employer
 *
 * /v1/employers/updateemail
 *
 * Must be logged in
 * Roles: ['employer']
 */
async function V1UpdateEmail(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.employer) method = `V1UpdateEmail`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Export an employer
 *
 * /v1/employers/export
 *
 * Must be logged in
 * Roles: ['employer']
 */
async function V1Export(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.employer) method = `V1Export`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}
