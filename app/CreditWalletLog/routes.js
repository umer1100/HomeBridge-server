/**
 * CREDITWALLETLOG ROUTES
 *
 * This is where we define all the routes for the CreditWalletLog feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches CreditWalletLog feature routes to the global router object
module.exports = (passport, router) => {

  // routes - can also use router.get or router.post
  router.all('/v1/creditwalletlogs/read', controller.V1Read);

  // return router
  return router;
};
