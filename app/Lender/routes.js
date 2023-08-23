/**
 * LENDER ROUTES
 *
 * This is where we define all the routes for the Lender feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches Lender feature routes to the global router object
module.exports = (passport, router) => {

  // routes - can also use router.get or router.post
  router.all('/v1/lenders/create', controller.V1Create);
  router.all('/v1/lenders/query', controller.V1Query);

  // return router
  return router;
};
