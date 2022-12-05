/**
 * TEST User V1Update METHOD
 */

 'use strict';

 // build-in node modules
 const path = require('path');

 // load test env
 require('dotenv').config({ path: path.join(__dirname, '../../../../config/.env.test') });

 // third party
 const i18n = require('i18n'); // https://github.com/mashpie/i18n-node

 // server & models
 const app = require('../../../../server');
 const models = require('../../../../models');

 // assertion library
 const { expect } = require('chai');
 const request = require('supertest');

 // services
 const { errorResponse, ERROR_CODES } = require('../../../../services/error');

 // helpers
 const { userLogin, reset, populate } = require('../../../../helpers/tests');
const user = require('../../../../test/fixtures/fix1/user');

 describe('User.V1Update', async () => {
   // grab fixtures here
   const userFix = require('../../../../test/fixtures/fix1/user');

   // url of the api method we are testing
   const routeVersion = '/v1';
   const routePrefix = '/users';
   const routeMethod = '/update';
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

     it('[logged-out] should fail to update user', async () => {
       // update request
       try {
         const res = await request(app).get(routeUrl);
         expect(res.statusCode).to.equal(401);
         expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
       } catch (error) {
         throw error;
       }
     }); // END [logged-out] should fail to update admin
   }); // END Role: Logged Out

   describe('Role: User', async () => {
     const jwt = 'jwt-user';

     // populate database with fixtures
     beforeEach(async () => {
       await populate('fix1');
     });

     it('[user] should update self primary goal and goal time line', async () => {

       const user1 = userFix[0];

       try {
         // login user
         const { token } = await userLogin(app, routeVersion, request, user1);
         const params = {
           primaryGoal: 'Save up for a down payment',
           goalTimeline: '1-2 years'
         }

         // update user request
         const res = await request(app)
           .post(routeUrl)
           .set('authorization', `${jwt} ${token}`)
           .send(params);

         expect(res.statusCode).to.equal(200);
         expect(res.body).to.have.property('success', true);
         expect(res.body).to.have.property('user');
         expect(res.body.user).to.have.property('id', user1.id);

         // find user to see if he's updated
         const foundUser = await models.user.findByPk(user1.id);
         expect(foundUser.primaryGoal).to.equal(params.primaryGoal);
         expect(foundUser.goalTimeline).to.equal(params.goalTimeline);
       } catch (error) {
         throw error;
       }
     }); // END [user] should update self primary goal and goal time line

     it('[user] should successfully update self if status is valid', async () => {
       const user1 = userFix[0];
       try {
         // login admin
         const { token } = await userLogin(app, routeVersion, request, user1);

         const params = {
           status: 'INACTIVE',
         };

         // update user request
         const res = await request(app)
           .post(routeUrl)
           .set('authorization', `${jwt} ${token}`)
           .send(params);

         expect(res.statusCode).to.equal(200);
       } catch (error) {
         throw error;
       }
     }); // [user] should successfully update self if status is valid
   }); // END Role: user
 }); // END User.V1Update
