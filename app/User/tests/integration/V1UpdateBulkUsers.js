/**
 * TEST User V1UpdateBulkUsers METHOD
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

describe('User.V1UpdateBulkUsers', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/users';
  const routeMethod = '/update-bulk-users';
  const routeUrl = `${routeVersion}${routePrefix}${routeMethod}`;

  // clear database
  beforeEach(async () => {
    await reset();
    await populate('fix1');
  });

  // Logged Out
  describe('Role: Logged Out', async () => {
    it('[logged-out] should fail to update bulk users', async () => {
      // update request
      try {
        const res = await request(app).get(routeUrl);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to update bulk users
  }); // END Role: Logged Out

  // Employee
  describe('Role: Employee', async () => {
    const jwt = 'jwt-user';

    it('[Employee] should fail to update bulk users', async () => {
      const user = userFix[3];
      expect(user.roleType).to.equal('EMPLOYEE');

      // update request
      try {
        const { token } = await userLogin(app, routeVersion, request, user);
        const params = {
          users: [userFix[1], userFix[2]],
          payload: { status: 'PAUSE' }
        }

        // update user request
        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(params);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [Employee] should fail to update bulk users
  }); // END Role: Employee

  // Employer
  describe('Role: Employer', async () => {
    const jwt = 'jwt-user';

    it('[users] should fail to update a user with roleType Employer', async () => {
      const user1 = userFix[0];
      expect(user1.roleType).to.equal('EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);
        const params = {
          users: [userFix[0], userFix[1]],
          payload: { action: 'PAUSE' }
        }

        // update user request
        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid request, cannot update EMPLOYER.')

      } catch (error) {
        throw error;
      }
    }); //END [users] should fail to update a user with roleType Employer

    it('[users] should fail to pause a user if user is already paused', async () => {
      const user1 = userFix[0];
      expect(user1.roleType).to.equal('EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);
        const params = {
          users: [userFix[3], userFix[8]],
          payload: { action: 'PAUSE' }
        }

        // update user request
        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid action, user already paused.')

      } catch (error) {
        throw error;
      }
    }); //END [users] should fail to pause a user if user is already paused

    it('[users] should fail to unpause a user if user is already unpaused', async () => {
      const user1 = userFix[0];
      expect(user1.roleType).to.equal('EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          users: [userFix[3], userFix[6]],
          payload: { action: 'UNPAUSE' }
        }

        // update user request
        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid action, users must be paused.')

      } catch (error) {
        throw error;
      }
    }); //END [users] should fail to unpause a user if user is already unpaused

    it('[users] should update all the users with valid payload object ', async () => {
      const user1 = userFix[0];
      expect(user1.roleType).to.equal('EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);
        const params = {
          users: [userFix[1], userFix[2]],
          payload: { action: 'PAUSE' }
        }

        // update user request
        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(params);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('success', true);

        // find users to see if he's updated;
        const foundUser1 = await models.user.findByPk(userFix[1].id);
        const foundUser2 = await models.user.findByPk(userFix[2].id);

        expect(foundUser1['status']).to.equal(Object.values(params.payload)[0]);
        expect(foundUser2['status']).to.equal(Object.values(params.payload)[0]);

      } catch (error) {
        throw error;
      }
    }); // [users] should update all the users with valid payload object

    it('[users] should update all the users to previous status when action is UNPAUSE', async () => {
      const user1 = userFix[0];
      expect(user1.roleType).to.equal('EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);
        let paramsToPauseUser = {
          users: [userFix[1], userFix[6]],
          payload: { action: 'PAUSE' }
        }

        expect(userFix[1].status).to.equal('ACTIVE');
        expect(userFix[6].status).to.equal('PENDING');

        // update user request
        const res1 = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(paramsToPauseUser);

        expect(res1.statusCode).to.equal(200);
        expect(res1.body).to.have.property('success', true);

        // find users to see if all users status change to PAUSE
        const pauseUser1 = await models.user.findByPk(userFix[1].id);
        const pauseUser2 = await models.user.findByPk(userFix[6].id);

        expect(pauseUser1['status']).to.equal('PAUSE');
        expect(pauseUser2['status']).to.equal('PAUSE');

        let paramsToUnpauseUser = {
          users: [pauseUser1.dataValues, pauseUser2.dataValues],
          payload: { action: 'UNPAUSE' }
        }

        const res2 = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(paramsToUnpauseUser);

        expect(res2.statusCode).to.equal(200);
        expect(res2.body).to.have.property('success', true);

        // find users to see if users updated to previous status;
        const unpauseUser1 = await models.user.findByPk(userFix[1].id);
        const unpauseUser2 = await models.user.findByPk(userFix[6].id);

        expect(unpauseUser1['status']).to.equal('ACTIVE');
        expect(unpauseUser2['status']).to.equal('PENDING');

      } catch (error) {
        throw error;
      }
    }); // [users] should update all the users to previous status when action is UNPAUSE

    it('[users] should fail to update users without payload', async () => {
      const user1 = userFix[0];
      expect(user1.roleType).to.equal('EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);
        const params = {
          users: [userFix[1], userFix[2]],
        }

        // update user request
        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.equal('BAD_REQUEST_INVALID_ARGUMENTS');
        expect(res.body.message).to.equal('Invalid payload')

      } catch (error) {
        throw error;
      }
    }); //END [users] should fail to update users without payload

    it('[users] should fail to update users with invalid payload object', async () => {
      const user1 = userFix[0];
      expect(user1.roleType).to.equal('EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);
        const params = {
          users: [userFix[1], userFix[2]],
          payload: { action: 'lorem ipsum' }
        }

        // update user request
        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.equal('BAD_REQUEST_INVALID_ARGUMENTS');
        expect(res.body.message).to.equal('Invalid payload')

      } catch (error) {
        throw error;
      }
    }); //END [users] should fail to update users with invalid payload object

    it('[users] should fail to update users with invalid users argument', async () => {
      const user1 = userFix[0];
      expect(user1.roleType).to.equal('EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);
        const params = {
          users: userFix[2],
          payload: { status: 'PAUSE' }
        }

        // update user request
        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.equal('BAD_REQUEST_INVALID_ARGUMENTS');
        expect(res.body.message).to.equal('"users" must be an array')

      } catch (error) {
        throw error;
      }
    }); //END [users] should fail to update users with invalid users argument
  }); // END Role: Employer
});
