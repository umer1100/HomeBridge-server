/**
 * TEST CREDITWALLET V1Add METHOD
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

describe('CreditWallet.V1Add', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/creditwallets';
  const routeMethod = '/add';
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

    it('[logged-out] should fail to add to a wallet', async () => {
      try {
        const params = {
          creditWalletId: 1,
          creditAmount: 20.0
        };
        const res = await request(app).post(`${routeUrl}`).send(params);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to credit wallet
  }); // END Role: Logged Out

  // User can read their own credit wallet
  describe('Role: User all roles', async () => {
    const jwt = 'jwt-user';
    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[Employer] should add to their own wallet', async () => {
      const employer = userFix[0];

      try {
        const { token, response } = await userLogin(app, routeVersion, request, employer);

        // add wallet credit request
        const params = {
          userId: 1,
          creditAmount: 20.0
        };
        const res = await request(app).post(`${routeUrl}`).set('authorization', `${jwt} ${token}`).send(params);
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.ownerificDollars).to.equal('20.00');
      } catch (error) {
        throw error;
      }
    }); // [Employer] read their ownerific dollars

    it('[Employee] should not add to their ownerific dollars', async () => {
      const employee = userFix[3];

      try {
        const { token, response } = await userLogin(app, routeVersion, request, employee);
        const params = {
          userId: 3,
          creditAmount: 20.0
        };
        // add wallet credit request
        const res = await request(app).post(`${routeUrl}`).set('authorization', `${jwt} ${token}`).send(params);
        expect(res.statusCode).to.equal(401);
      } catch (error) {
        throw error;
      }
    }); // [Employee] should not add to their ownerific dollars
  }); // END Role: all roles
}); // END CreditWallet.V1Add
