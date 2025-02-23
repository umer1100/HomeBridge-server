/**
 * CREDITWALLET ROUTES
 *
 * This is where we define all the routes for the CreditWallet feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches CreditWallet feature routes to the global router object
module.exports = (passport, router) => {
  // routes - can also use router.get or router.post
  router.all('/v1/creditwallets/add', controller.V1Add);
  router.all('/v1/creditwallets/read', controller.V1Read);

  // return router
  return router;
};
