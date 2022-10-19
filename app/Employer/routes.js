/**
 * EMPLOYER ROUTES
 *
 * This is where we define all the routes for the Employer feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches Employer feature routes to the global router object
module.exports = (passport, router) => {
  // routes - can also use router.get or router.post
  router.all('/v1/employers/login', controller.V1Login);
  router.all('/v1/employers/resetpassword', controller.V1ResetPassword);
  router.all('/v1/employers/confirmpassword', controller.V1ConfirmPassword);
  router.all('/v1/employers/read', controller.V1Read);
  router.all('/v1/employers/create', controller.V1Create);
  router.all('/v1/employers/update', controller.V1Update);
  router.all('/v1/employers/query', controller.V1Query);
  router.all('/v1/employers/updatepassword', controller.V1UpdatePassword);
  router.all('/v1/employers/updateemail', controller.V1UpdateEmail);
  router.all('/v1/employers/export', controller.V1Export);

  // return router
  return router;
};
