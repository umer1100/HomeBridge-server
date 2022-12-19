/**
 * TEST USER V1UpdatePassword METHOD
 */

 'use strict';

 // build-in node modules
 const path = require('path');

 // load test env
 require('dotenv').config({ path: path.join(__dirname, '../../../../config/.env.test') });

 // third party
 const i18n = require('i18n'); // https://github.com/mashpie/i18n-node
 const bcrypt = require('bcrypt');

 // server & models
 const app = require('../../../../server');
 const { user } = require('../../../../models');

 // assertion library
 const { expect } = require('chai');
 const request = require('supertest');
 const { errorResponse, ERROR_CODES } = require('../../../../services/error');

 // services

 // helpers
 const { userLogin, reset, populate } = require('../../../../helpers/tests');

 describe('User.V1UpdatePassword', async () => {
   // grab fixtures here
   const userFix = require('../../../../test/fixtures/fix1/user');

   // url of the api method we are testing
   const routeVersion = '/v1';
   const routePrefix = '/users';
   const routeMethod = '/update-password';
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

    it('[logged-out] should fail to update users password', async () => {
      try {
        const res = await request(app).post(routeUrl);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to update user password
  }); // END Role: Logged Out

   // Logged In
   describe('Role: Logged In', async () => {
     // populate database with fixtures
     beforeEach(async () => {
       await populate('fix1');
     });

     it('[user] should fail to update password with invalid arguments', async () => {
       const jwt = 'jwt-user';
       const user1 = userFix[0];
       try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          currentPassword: 'oldPassword',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.equal('BAD_REQUEST_INVALID_ARGUMENTS');
       } catch (error) {
         throw error;
       }
     }); // END [user] should fail to update password with invalid arguments

     it('[user] should fail to update password if new password and confirm password are not same', async () => {
       const jwt = 'jwt-user';
       const user1 = userFix[0];
       try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          password: 'oldPassword',
          password1: 'thisisapasswordworng1F%',
          password2: 'thisisapassword1F%',
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.equal('USER.BAD_REQUEST_PASSWORDS_NOT_EQUAL');
       } catch (error) {
         throw error;
       }
     }); // END [user] should fail to update password if new password and confirm password are not same

     it('[user] should fail to update password if current password is incorrect', async () => {
      const jwt = 'jwt-user';
      const user1 = userFix[0];
      try {
       // login user
       const { token } = await userLogin(app, routeVersion, request, user1);

       const params = {
         password: 'incorrectPassword#',
         password1: 'thisisapassword1F%',
         password2: 'thisisapassword1F%',
       };
       // create user request
       const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

       expect(res.statusCode).to.equal(400);
       expect(res.body.error).to.equal('USER.BAD_REQUEST_PASSWORD_AUTHENTICATION_FAILED');
      } catch (error) {
        throw error;
      }
    }); // END [user] should fail to update password if current password is incorrect

    it('[user] should successfully update the password', async () => {
      const jwt = 'jwt-user';
      const user1 = userFix[0];
      try {
       // login user
       const { token } = await userLogin(app, routeVersion, request, user1);
       const params = {
         password: userFix[0].password,
         password1: 'thisisapassword1F%',
         password2: 'thisisapassword1F%',
       };
       // create user request
       const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);
       expect(res.statusCode).to.equal(200);
      } catch (error) {
        throw error;
      }
    }); // END [user] successfully update the password
   }); // END Role: Logged Out
 }); // END User.V1UpdatePassword
