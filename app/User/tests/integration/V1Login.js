/**
 * TEST USER V1Login METHOD
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

describe('User.V1Login', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/users';
  const routeMethod = '/login';
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

    it('[logged-out] should login user successfully', async () => {
      const user1 = userFix[0];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const res = await request(app).post(routeUrl).send(params);

        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('token').and.to.a('string');
        expect(res.body).to.have.property('user').and.to.not.be.null;

        // check if user is updated in database
        const checkUser = await models.user.findByPk(user1.id);
        expect(checkUser.loginCount).to.equal(1);
        expect(checkUser.lastLogin).to.not.be.null;
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should login user successfully

    it('[logged-out] should login user successfully and also return organization details', async () => {
      const user1 = userFix[0];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const res = await request(app).post(routeUrl).send(params);

        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('token').and.to.a('string');
        expect(res.body).to.have.property('user').and.to.not.be.null;
        expect(res.body.user).to.have.property('organization').and.to.not.be.null;
      } catch (error) {
        throw error;
      }
    }); // END [logged-out]  should login user successfully and also return organization details

    it('[logged-out] should fail to login user email or password is incorrect', async () => {
      const params = {
        email: 'random@email.com',
        password: '1029384756'
      };

      try {
        // login user
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to login user email or password is incorrect

    it('[logged-out] should fail to login user if account is not active', async () => {
      const user1 = userFix[0];

      try {
        // update user status to false
        await models.user.update(
          {
            status: 'INACTIVE'
          },
          {
            where: {
              id: user1.id
            }
          }
        );

        const params = {
          email: user1.email,
          password: user1.password
        };

        // login user
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_INACTIVE));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to login user if account is not active

    it('[logged-out] should fail to login user if account is deleted', async () => {
      const user1 = userFix[0];

      try {
        // set user as deleted
        await models.user.update(
          {
            deletedAt: moment.tz('UTC')
          },
          {
            where: {
              id: user1.id
            }
          }
        );

        const params = {
          email: user1.email,
          password: user1.password
        };

        // login user
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_DELETED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to login user if account is deleted

    it('[logged-out] should fail to login user (GUEST) if email is not confirmed', async () => {
      const user = userFix[5];

      try {
        const params = {
          email: user.email,
          password: user.password
        };
        expect(user.roleType).to.equal('GUEST');

        // login user
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_EMAIL_CONFIRMATION_PENDING));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to login user (GUEST) if email is not confirmed

    it('[logged-out] Should successfully login user and match JWT token in the session', async () => {
      const user = userFix[3];

      try {
        const params = {
          email: user.email,
          password: user.password
        };

        // login user
        const res = await request(app).post(routeUrl).send(params);
        const session = await models.session.findOne({
          where: {
            jwt: res.body.token
          }
        })

        expect(session.jwt).to.equal(res.body.token)
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] Should successfully login user and match JWT token in the session

    it('[logged-out] should fail to login user (except GUEST) if email is not confirmed', async () => {
      const user = userFix[2];

      try {
        const params = {
          email: user.email,
          password: user.password
        };
        expect(user.roleType).to.equal('MANAGER');

        // login user
        const res = await request(app).post(routeUrl).send(params);

        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('token').and.to.a('string');
        expect(res.body).to.have.property('user').and.to.not.be.null;
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to login user (GUEST) if email is not confirmed
  }); // END Role: Logged Out
}); // END User.V1Login
