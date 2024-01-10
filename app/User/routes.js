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
  router.all('/v1/users/update', controller.V1Update);
  router.all('/v1/users/sendBulkInvitation', controller.V1BulkInvitation);
  router.all('/v1/users/update-bulk-users', controller.V1UpdateBulkUsers);
  router.all('/v1/users/logout', controller.V1Logout);
  router.post('/v1/users/employer/signUp', controller.V1EmployerSignUp);
  router.post('/v1/users/employer/signUp/oauth', controller.V1EmployerSignUpOAuth);
  router.post('/v1/users/signIn/oauth', controller.V1SignInOAuth);
  router.post('/v1/users/email', controller.V1SendEmail);
  // return router
  return router;
};
