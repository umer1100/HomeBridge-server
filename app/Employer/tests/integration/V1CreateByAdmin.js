/**
 * TEST EMPLOYER V1CreateByEAdmin METHOD
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
const { adminLogin, reset, populate } = require('../../../../helpers/tests');

describe('Employer.V1CreateByAdmin', async () => {
  // grab fixtures here
  const adminFix = require('../../../../test/fixtures/fix1/admin');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/employers';
  const routeMethod = '/create';
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

    it('[logged-out] should fail to create employers', async () => {
      try {
        const res = await request(app).get(routeUrl);
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to create employer
  }); // END Role: Logged Out

  // Employer
  describe('Role: Admin', async () => {
    const jwt = 'jwt-admin';

    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[admin] should create an employer successfully', async () => {
      const admin1 = adminFix[0];

      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        const params = {
          name: 'John Doe',
          active: true,
          email: 'new-admin@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };

        // create employer request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(201);
        expect(res.body.employer.id).to.equal(1);
        expect(res.body.employer.timezone).to.equal(params.timezone);
        expect(res.body.employer.locale).to.equal(params.locale);
        expect(res.body.employer.active).to.be.true;
        expect(res.body.employer.name).to.equal(params.name);
        expect(res.body.employer.email).to.equal(params.email);
        expect(res.body.employer.phone).to.equal(params.phone);
        expect(res.body.employer.passwordResetExpire).to.be.a('string');
        expect(res.body.employer.loginCount).to.equal(0);
        expect(res.body.employer.lastLogin).to.be.null;
        expect(res.body.employer.createdAt).to.be.a('string');
        expect(res.body.employer.updatedAt).to.be.a('string');

        // check if employer was created
        const checkEmployer = await models.employer.findByPk(res.body.employer.id);
        expect(checkEmployer.name).to.equal(params.name);
        expect(checkEmployer.timezone).to.equal(params.timezone);
        expect(checkEmployer.locale).to.equal(params.locale);
        expect(checkEmployer.active).to.be.true;
        expect(checkEmployer.name).to.equal(params.name);
        expect(checkEmployer.email).to.equal(params.email);
        expect(checkEmployer.phone).to.equal(params.phone);
        expect(checkEmployer.passwordResetExpire).to.not.be.null;
        expect(checkEmployer.loginCount).to.equal(0);
        expect(checkEmployer.lastLogin).to.be.null;
        expect(checkEmployer.createdAt).to.not.be.null;
        expect(checkEmployer.updatedAt).to.not.be.null;
      } catch (error) {
        throw error;
      }
    }); // END [admin] should create an employer successfully

    it('[admin] should not create new employer if passwords format is invalid', async () => {
      const admin1 = adminFix[0];

      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        const params = {
          name: 'John Doe',
          active: true,
          email: 'new-admin@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword',
          password2: 'thisisapassword',
          acceptedTerms: true
        };

        // create admin request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, i18n.__('EMPLOYER[Invalid Password Format]')));
      } catch (error) {
        throw error;
      }
    }); // END [admin] should not create new employer if passwords format is invalid

    it('[admin] should not create new employer if passwords are not the same', async () => {
      const admin1 = adminFix[0];

      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        const params = {
          name: 'John Doe',
          active: true,
          email: 'new-employer@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword2F%',
          acceptedTerms: true
        };

        // create admin request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.EMPLOYER_BAD_REQUEST_PASSWORDS_NOT_EQUAL));
      } catch (error) {
        throw error;
      }
    }); // END [admin] should not create new employer if passwords are not the same

    it('[admin] should not create new employer if acceptedTerms is false', async () => {
      const admin1 = adminFix[0];

      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        const params = {
          name: 'John Doe',
          active: true,
          email: 'new-employer@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: false
        };

        // create admin request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.EMPLOYER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED));
      } catch (error) {
        throw error;
      }
    }); // END [admin] should not create new admin if acceptedTerms is false

    it('[admin] should not create new admin if email already exists', async () => {
      const admin1 = adminFix[0];

      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        const params = {
          name: 'John Doe',
          active: true,
          email: 'new-employer@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };

        // create admin request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.EMPLOYER_BAD_REQUEST_EMPLOYER_ALREADY_EXISTS));
      } catch (error) {
        throw error;
      }
    }); // END [admin] should not create new employer if email already exists

    it('[admin] should not create new employer if timezone is invalid', async () => {
      const admin1 = adminFix[0];

      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        const params = {
          name: 'John Doe',
          active: true,
          email: 'new-employer@example.com',
          phone: '+12406206950',
          timezone: 'invalid-timezone',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };

        // create admin request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.EMPLOYER_BAD_REQUEST_INVALID_TIMEZONE));
      } catch (error) {
        throw error;
      }
    }); // END [admin] should not create new admin if timezone is invalid
  }); // END Role: Employer
}); // END Employer.V1Create
