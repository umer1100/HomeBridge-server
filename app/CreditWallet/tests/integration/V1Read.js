/**
 * TEST CREDITWALLET V1Read METHOD
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

describe('CreditWallet.V1Read', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/creditwallets';
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

    it('[logged-out] should fail to read users', async () => {
      try {
        const res = await request(app).get(`${routeUrl}?id=1`);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to read credit wallet
  }); // END Role: Logged Out

  // User can read their own credit wallet
  describe('Role: User all roles', async () => {
    const jwt = 'jwt-user';
    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[Employee] should read their credit wallets', async () => {
      const employee = userFix[3];

      try {
        const { token, response } = await userLogin(app, routeVersion, request, employee);
        expect(response.body.user.roleType).to.equal('EMPLOYEE');

        // read user request
        const res = await request(app).get(`${routeUrl}`).set('authorization', `${jwt} ${token}`);
        expect(res.statusCode).to.equal(200);

        let [employerWallet, platformWallet] = res.body.data

        expect(employerWallet.walletType).to.equal('EMPLOYER');
        expect(platformWallet.walletType).to.equal('PLATFORM');
        expect(employerWallet.dollars).to.equal('0.00');
        expect(platformWallet.dollars).to.equal('0.00');
      } catch (error) {
        throw error;
      }
    }); // [Employee] should read their credit wallets
  }); // END Role: all roles
}); // END CreditWallet.V1Read
