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
  router.all('/v1/organizations/read', controller.V1Read);
  router.all('/v1/organizations/create', controller.V1Create);
  router.all('/v1/organizations/update', controller.V1Update);
  router.all('/v1/organizations/query', controller.V1Query);
  router.all('/v1/organizations/updateemail', controller.V1UpdateEmail);
  router.all('/v1/organizations/export', controller.V1Export);
  router.all('/v1/organizations/store-hris-access-token', controller.V1UpdateHrisAccessToken);
  router.all('/v1/organizations/users', controller.V1GetUsers);
  router.all('/v1/organizations/get-average-ownerific-credit', controller.V1GetAverageOwnerificCredit);
  router.all('/v1/organizations/get-average-home-price', controller.V1GetAverageHomePrice);
  router.all('/v1/organizations/get-total-ownerific-credit', controller.V1GetTotalOwnerificCredit);
  router.all('/v1/organization/users-plaid-accounts', controller.V1GetUsersPlaidAccountDetails);
  router.all('/v1/hris/company', controller.V1GetCompanyDetailsFromFinch);

  // return router
  return router;
};
