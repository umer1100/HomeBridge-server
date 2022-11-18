/**
 * TEST USER V1ConfirmEmail METHOD
 */

 'use strict';

 // build-in node modules
 const path = require('path');

 // load test env
 require('dotenv').config({ path: path.join(__dirname, '../../../../config/.env.test') });

 // third party
 const i18n = require('i18n'); // https://github.com/mashpie/i18n-node
 const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

 // server & models
 const app = require('../../../../server');
 const models = require('../../../../models');

 // assertion library
 const { expect } = require('chai');
 const request = require('supertest');

 // services
 const { errorResponse, ERROR_CODES } = require('../../../../services/error');

 // helpers
 const { reset, populate } = require('../../../../helpers/tests');

 describe('User.V1ConfirmLogin', async () => {
   // grab fixtures here
   const userFix = require('../../../../test/fixtures/fix1/user');

   // url of the api method we are testing
   const routeVersion = '/v1';
   const routePrefix = '/users';
   const routeMethod = '/confirm-email';
   const routeUrl = `${routeVersion}${routePrefix}${routeMethod}`;

   // clear database
   beforeEach(async () => {
     await reset();
   });

   // Logged Out
   describe('Role: Logged Out', async () => {
     // populate database with fixtures
     beforeEach(async () => {
       await populate('fix1');
     });

     it('[logged-out] should confirm email with valid emailConfirmationToken', async () => {
      const user = userFix[5];

       try {
         expect(user.status).to.equal('PENDING');
         expect(user.emailConfirmed).to.be.false;

         const res = await request(app).get(`${routeUrl}?emailConfirmationToken=${user.emailConfirmedToken}`);

         expect(res.body).to.have.property('success', true);

         // check if user is updated in database
         const checkUser = await models.user.findByPk(user.id);

         expect(checkUser.status).to.equal('ACTIVE');
         expect(checkUser.emailConfirmed).to.be.true;
       } catch (error) {
         throw error;
       }
     }); // END [logged-out] should confirm email with valid emailConfirmationToken

     it('[logged-out] should return with exception with invalid emailConfirmationToken', async () => {
      const user = userFix[5];

       try {
         const res = await request(app).get(`${routeUrl}?emailConfirmationToken=invalidEmailConfirmationToken`);

         expect(res.body).to.have.property('success', false);
         expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_INVALID_EMAIL_CONFIRMATION_TOKEN));
       } catch (error) {
         throw error;
       }
     }); // END [logged-out] should return with exception with invalid emailConfirmationToken

     it('[logged-out] should return with exception when emailConfirmationToken is not passed', async () => {
      const user = userFix[5];

       try {
         const res = await request(app).get(routeUrl);

         expect(res.body).to.have.property('success', false);
         expect(res.body.message).to.equal('"emailConfirmationToken" is required');
       } catch (error) {
         throw error;
       }
     }); // END [logged-out] should return with exception when emailConfirmationToken is not passed
   }); // END Role: Logged Out
 }); // END User.V1Login
