/**
 * TEST ORGANIZATION V1GetUsers METHOD
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

// assertion library
const { expect } = require('chai');
const request = require('supertest');

// services
const { errorResponse, ERROR_CODES } = require('../../../../services/error');

// helpers
const { userLogin, reset, populate } = require('../../../../helpers/tests');

describe('Organization.V1GetUsers', async () => {
  const userFix = require('../../../../test/fixtures/fix1/user');

  const routeVersion = '/v1';
  const routePrefix = '/organizations';
  const routeMethod = '/users';
  const routeUrl = `${routeVersion}${routePrefix}${routeMethod}`;

  beforeEach(async () => {
    await reset();
  });

  describe('Role: Logged Out', async () => {
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[logged-out] should fail to get users', async () => {
      try {
        const res = await request(app).get(routeUrl);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    });
  });

  describe('Role: User', async () => {
    const jwt = 'jwt-user';

    beforeEach(async () => {
      await populate('fix1');
    });

    it('[user] should get all users associated with organization with valid params', async () => {
      const user = userFix[0];

      try {
        const { token } = await userLogin(app, routeVersion, request, user);
        const params = {
          organizationId: user.organizationId
        };
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('success', true);
      } catch (error) {
        throw error;
      }
    }); // end [user] should get all users associated with organization with valid params'

    it('[user] should get all users associated with organization if params not provided it will set users organization as default params', async () => {
      const user = userFix[0];

      try {
        const { token } = await userLogin(app, routeVersion, request, user);
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('success', true);
      } catch (error) {
        throw error;
      }
    }); // end [user] should get all users associated with organization if params not provided it will set users organization as default params


    it('[user] should fail to get users if no params are provided and user does not belong to any organization', async () => {
      let user = userFix[7];

      try {
        const { token } = await userLogin(app, routeVersion, request, user);

        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.have.property('success', false);
      } catch (error) {
        throw error;
      }
    }); // end [user] should get all users associated with organization with valid params'
  });
});
