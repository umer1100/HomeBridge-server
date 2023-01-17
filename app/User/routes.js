/**
 * USER ROUTES
 *
 * This is where we define all the routes for the User feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches User feature routes to the global router object
module.exports = (passport, router) => {
  // routes - can also use router.get or router.post
  router.all('/v1/users/create', controller.V1Create);
  router.all('/v1/users/login', controller.V1Login);
  router.all('/v1/users/confirm-email', controller.V1ConfirmEmail);
  router.all('/v1/users/read', controller.V1Read);
  router.all('/v1/users/send-reset-password-token', controller.V1SendResetPasswordToken);
  router.all('/v1/users/reset-password', controller.V1ResetPassword);
  router.all('/v1/users/update-password', controller.V1UpdatePassword);
  router.all('/v1/users/update', controller.V1Update)
  // return router
  return router;
};
