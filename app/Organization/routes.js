/**
 * ORGANIZATION ROUTES
 *
 * This is where we define all the routes for the Organization feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches Organization feature routes to the global router object
module.exports = (passport, router) => {
  // routes - can also use router.get or router.post
  router.all('/v1/organizations/login', controller.V1Login);
  router.all('/v1/organizations/resetpassword', controller.V1ResetPassword);
  router.all('/v1/organizations/confirmpassword', controller.V1ConfirmPassword);
  router.all('/v1/organizations/read', controller.V1Read);
  router.all('/v1/organizations/create', controller.V1Create);
  router.all('/v1/organizations/update', controller.V1Update);
  router.all('/v1/organizations/query', controller.V1Query);
  router.all('/v1/organizations/updatepassword', controller.V1UpdatePassword);
  router.all('/v1/organizations/updateemail', controller.V1UpdateEmail);
  router.all('/v1/organizations/export', controller.V1Export);

  // return router
  return router;
};
