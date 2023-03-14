/**
 * TEST PROGRAM V1Update METHOD
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
const { assert } = require('console');

describe('Program.V1Update', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');
  const programFix = require('../../../../test/fixtures/fix1/program');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/programs';
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

    it('[logged-out] should fail to update program', async () => {
      try {
        const res = await request(app).get(routeUrl);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to read admin
  }); // END Role: Logged Out

  // User
  describe('Role: User', async () => {
    const jwt = 'jwt-user';

    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[user] with roleType EMPLOYER should update a program successfully', async () => {
      const user1 = userFix[0];
      assert(user1.roleType == 'EMPLOYER');
      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        // params
        const params = {
          id: user1.organizationId, // organizationId and programId should be the same. We'll assume this for testing purposes
          isProgramActive: true
        };

        // read admin request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('program');
        expect(res.body.program).to.have.property('isProgramActive', true);
      } catch (error) {
        throw error;
      }
    }); // END [user] should read another admin successfully

    it('[user] roleType not EMPLOYER should fail to update program', async () => {
      const user1 = userFix[1];
      assert(user1.roleType != 'EMPLOYER');

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          id: 100000
        };

        // read program request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [user] roleType EMPLOYEE should fail to update program
  }); // END Role: User
}); // END Program.V1Read
