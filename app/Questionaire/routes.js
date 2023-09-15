/**
 * QUESTIONAIRE ROUTES
 *
 * This is where we define all the routes for the Questionaire feature.
 * These routes get exported to the global /routes.js file.
 */

'use strict';

// require controller
const controller = require('./controller');

// Returns a function that attaches Questionaire feature routes to the global router object
module.exports = (passport, router) => {

  router.all('/v1/questionaire/create', controller.V1Create);
  router.all('/v1/questionnaire/read', controller.V1Read);
  router.all('/v1/questionnaire/update', controller.V1Update);
  // return router
  return router;
};
