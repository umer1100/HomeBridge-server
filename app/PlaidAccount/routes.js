/**
 * PLAIDACCOUNT ROUTES
 *
 * This is where we define all the routes for the PlaidAccount feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches PlaidAccount feature routes to the global router object
module.exports = (passport, router) => {
  // routes - can also use router.get or router.post
  router.all('/v1/plaidaccounts/createaccesstoken', controller.V1CreateAccessToken);

  // return router
  return router;
};
