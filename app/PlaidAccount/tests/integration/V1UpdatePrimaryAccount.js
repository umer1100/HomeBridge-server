/**
 * TEST PLAIDACCOUNT V1UpdatePrimaryAccount METHOD
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

describe('PlaidAccount.V1UpdatePrimaryAccount', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');
  const plaidAccountFix = require('../../../../test/fixtures/fix1/plaidAccount');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/plaidaccounts';
  const routeMethod = '/updateprimaryaccount';
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

    it('[logged-out] should fail to read update primary account', async () => {
      try {
        const res = await request(app).get(routeUrl);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to read update primary account
  }); // END Role: Logged Out

  // User
  describe('Role: User', async () => {
    const jwt = 'jwt-user';

    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[user] should update a primary account successfully', async () => {
      const user1 = userFix[0];
      const plaidAccount1 = plaidAccountFix[1];

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        // params
        const params = {
          plaidAccountId: plaidAccount1.id
        };

        // update plaid account request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('success', true);
      } catch (error) {
        throw error;
      }
    }); // END [user] should update another the primary account successfully

    it('[user] should fail to update a primary account if the plaid account does not exist', async () => {
      const user1 = userFix[0];

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          plaidAccountId: 100000
        };

        // update plaid account request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.PLAIDACCOUNT_BAD_REQUEST_PLAIDACCOUNT_DOES_NOT_EXIST));
      } catch (error) {
        throw error;
      }
    }); // END [user] should fail to update plaid account to primary if plaid account does not exist
  }); // END Role: User
}); // END PlaidAccount.V1UpdatePrimaryAccount
