/**
 * TEST ORGANIZATION V1Read METHOD
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
const { adminLogin, organizationLogin, reset, populate } = require('../../../../helpers/tests');

describe('Organization.V1Read', async () => {
  // grab fixtures here
  const adminFix = require('../../../../test/fixtures/fix1/admin');
  const organizationFix = require('../../../../test/fixtures/fix1/organization');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/organizations';
  const routeMethod = '/read';
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

    it('[logged-out] should fail to read admin', async () => {
      try {
        const res = await request(app).get(routeUrl);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to read admin
  }); // END Role: Logged Out

  // Admin
  describe('Role: Admin', async () => {
    const jwt = 'jwt-admin';

    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[admin] should read an organization successfully', async () => {
      const admin1 = adminFix[0];
      const organization1 = organizationFix[0];

      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        // params
        const params = {
          id: organization1.id
        };

        // read admin request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('organization');
        expect(res.body.organization).to.have.property('id', organization1.id);
      } catch (error) {
        throw error;
      }
    }); // END [admin] should read another admin successfully

    it('[admin] should fail to read organization if organization does not exist', async () => {
      const admin1 = adminFix[0];

      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        const params = {
          id: 100000
        };

        // read organization request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.ORGANIZATION_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));
      } catch (error) {
        throw error;
      }
    }); // END [admin] should fail to read organization if organization does not exist
  }); // END Role: Admin
}); // END Organization.V1Read
