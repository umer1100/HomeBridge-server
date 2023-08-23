/**
 * RESOURCE ROUTES
 *
 * This is where we define all the routes for the Resource feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches Resource feature routes to the global router object
module.exports = (passport, router) => {

  // routes - can also use router.get or router.post
  router.all('/v1/resources/query', controller.V1Query);
  router.all('/v1/resources/create', controller.V1Create);

  // return router
  return router;
};
