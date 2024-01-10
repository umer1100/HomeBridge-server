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

// services
const { createQueue } = require('../../services/queue');

module.exports = {
  V1Create,
  V1Login,
  V1ConfirmEmail,
  V1Read,
  V1SendResetPasswordToken,
  V1ResetPassword,
  V1Update,
  V1UpdatePassword,
  V1PlaidCreateLinkToken,
  V1BulkInvitation,
  V1UpdateBulkUsers,
  V1Logout,
  V1EmployerSignUp,
  V1EmployerSignUpOAuth,
  V1SignInOAuth,
  V1SendEmail
};

const BulkInvitationQueue = createQueue('BulkInvitationQueue');

/**
 * Create Method
 *
 * /v1/users/create
 *
 * Roles: ['admin', 'user']
 */
async function V1Create(req, res, next) {
  let method = ''; // which action method to use

  if (req.admin) method = 'V1CreateByAdmin';
  else if (req.user && req.user.roleType !== ROLES.GUEST) method = 'V1CreateByOrganizationalUser';
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
  if (req.admin) method = `V1ReadByAdmin`;
  else if (req.user) method = `V1ReadByUser`;
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
 * Send Reset password Token to user
 *
 * /v1/users/send-reset-password-token
 *
 * Must be logged out
 */
async function V1SendResetPasswordToken(req, res, next) {
  let method = 'V1SendResetPasswordToken';

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Reset password of user
 *
 * /v1/users/reset-password
 *
 * Must be logged out
 */
async function V1ResetPassword(req, res, next) {
  let method = 'V1ResetPassword';

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Update user
 *
 * /v1/users/update
 *
 * Must be logged in
 */
async function V1Update(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.user) method = 'V1Update';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

/**
 * Update password of user
 *
 * /v1/users/update-password
 *
 * Must be logged in
 * Role: [User]
 */
async function V1UpdatePassword(req, res, next) {
  let method = null;

  if (req.user) method = 'V1UpdatePassword';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

async function V1PlaidCreateLinkToken(req, res, next) {
  let method = null;
  if (req.user) method = 'V1PlaidCreateLinkToken';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

async function V1UpdateBulkUsers(req, res, next) {
  let method = null;
  if (req.user && isEmployer(req.user)) method = 'V1UpdateBulkUsers';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

async function V1BulkInvitation(req, res, next) {
  if (req.user) {
    await BulkInvitationQueue.add('V1BulkInvitation', {
      users: req.args.users
    });
  } else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  return res.status(200).json({ success: true, message: 'Started Sending Emails' });
}

async function V1Logout(req, res, next) {
  let method = null;
  if (req.user) method = 'V1Logout';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}

async function V1EmployerSignUp(req, res, next) {
  let method = 'V1EmployerSignUp';

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status || 400).json(result);
}

async function V1EmployerSignUpOAuth(req, res, next) {
  let method = 'V1EmployerSignUpOAuth';

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status || 400).json(result);
}

async function V1SignInOAuth(req, res, next) {
  let method = 'V1SignInOAuth';

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status || 400).json(result);
}

async function V1SendEmail(req, res, next) {
  let method = 'V1SendEmail';

  const result = await actions[method](req).catch(err => next(err));
  return res.status(result?.status || 400).json(result);
}
