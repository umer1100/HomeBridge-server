/**
 * USER CONTROLLER
 *
 * Defines which User action methods are called based on the type of user role
 */

'use strict';

const { ROLES } = require('../../helpers/constants');
// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');

// actions
const actions = require('./actions');
const { isEmployer } = require('./helper');

module.exports = {
  V1Create,
  V1Login,
  V1ConfirmEmail,
  V1Read
};

/**
 * Example Method
 *
 * /v1/users/example
 *
 * Must be logged out | Must be logged in | Can be both logged in or logged out
 * Roles: ['admin', 'member']
 */
async function V1Example(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.admin) method = `V1ExampleByAdmin`;
  else if (req.member) method = `V1ExampleByMember`;
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
 * Create Method
 *
 * /v1/users/create
 *
 * Roles: ['admin', 'user']
 */
async function V1Create(req, res, next) {
  let method = ''; // which action method to use

  if (req.admin) method = `V1CreateByAdmin`;
  else if (req.user && req.user.roleType !== ROLES.GUEST) method = `V1CreateByOrganizationalUser`;
  else if (req.user && req.user.roleType === ROLES.GUEST) return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));
  else method = 'V1CreateGuest';

  // call correct method
  try {
    const result = await actions[method](req);
    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Login Method
 *
 * /v1/users/create
 *
 * Must be logged out
 * Roles: []
 */
async function V1Login(req, res, next) {
  let method = 'V1Login'; // which action method to use

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Confirm Email Method
 *
 * /v1/users/confirm-email
 *
 */
 async function V1ConfirmEmail(req, res, next) {
  let method = 'V1ConfirmEmail'; // which action method to use

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
 * /v1/users/read
 *
 * Must be logged in
 * Roles: [admin, user]
 */
async function V1Read(req, res, next) {
  let method = ''; // which action method to use

  // which method to call
  if (isEmployer(req?.user?.roleType) || req.admin || req?.user?.id == req?.args?.id) method = `V1Read`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}
