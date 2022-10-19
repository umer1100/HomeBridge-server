/**
 * TEST EMPLOYER V1Login METHOD
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

describe('Employer.V1Login', async () => {
  // grab fixtures here
  const employerFix = require('../../../../test/fixtures/fix1/employer');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/employers';
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

    it('[logged-out] should login employer successfully', async () => {
      const employer1 = employerFix[0];

      // login params
      const params = {
        email: employer1.email,
        password: employer1.password
      };

      try {
        // login employer
        const res = await request(app).post(routeUrl).send(params);

        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('token').and.to.a('string');
        expect(res.body).to.have.property('employer').and.to.not.be.null;

        // check if employer is updated in database
        const checkEmployer = await models.employer.findByPk(employer1.id);
        expect(checkEmployer.loginCount).to.equal(1);
        expect(checkEmployer.lastLogin).to.not.be.null;
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should login employer successfully

    it('[logged-out] should fail to login employer email or password is incorrect', async () => {
      const params = {
        email: 'random@email.com',
        password: '1029384756'
      };

      try {
        // login employer
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.EMPLOYER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to login employer email or password is incorrect

    it('[logged-out] should fail to login employer if account is not active', async () => {
      const employer1 = employerFix[0];

      try {
        // update employer status to false
        await models.employer.update(
          {
            active: false
          },
          {
            where: {
              id: employer1.id
            }
          }
        );

        const params = {
          email: employer1.email,
          password: employer1.password
        };

        // login employer
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.EMPLOYER_BAD_REQUEST_ACCOUNT_INACTIVE));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to login employer if account is not active

    it('[logged-out] should fail to login employer if account is deleted', async () => {
      const employer1 = employerFix[0];

      try {
        // set employer as deleted
        await models.employer.update(
          {
            deletedAt: moment.tz('UTC')
          },
          {
            where: {
              id: employer1.id
            }
          }
        );

        const params = {
          email: employer1.email,
          password: employer1.password
        };

        // login employer
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.EMPLOYER_BAD_REQUEST_ACCOUNT_DELETED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to login employer if account is deleted
  }); // END Role: Logged Out
}); // END Employer.V1Login
