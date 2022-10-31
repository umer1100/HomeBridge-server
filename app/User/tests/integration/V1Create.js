/**
 * TEST User V1Create METHOD
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
const { reset, populate } = require('../../../../helpers/tests');
const user = require('../../../../test/fixtures/fix1/user');

describe('User.V1Create', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/users';
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

    it('[logged-out] should create user successfully', async () => {
      try {
        const params = {
          firstName: 'First',
          lastName: 'Last',
          active: true,
          email: 'new-user@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(201);
        expect(res.body.user.id).to.equal(user.length + 1);
        expect(res.body.user.timezone).to.equal(params.timezone);
        expect(res.body.user.locale).to.equal(params.locale);
        expect(res.body.user.active).to.be.true;
        expect(res.body.user.name).to.equal(params.name);
        expect(res.body.user.email).to.equal(params.email);
        expect(res.body.user.phone).to.equal(params.phone);
        expect(res.body.user.passwordResetExpire).to.be.a('string');
        expect(res.body.user.loginCount).to.equal(0);
        expect(res.body.user.lastLogin).to.be.null;
        expect(res.body.user.createdAt).to.be.a('string');
        expect(res.body.user.updatedAt).to.be.a('string');

        // check if user was created
        const checkUser = await models.user.findByPk(res.body.user.id);
        expect(checkUser.name).to.equal(params.name);
        expect(checkUser.timezone).to.equal(params.timezone);
        expect(checkUser.locale).to.equal(params.locale);
        expect(checkUser.active).to.be.true;
        expect(checkUser.name).to.equal(params.name);
        expect(checkUser.email).to.equal(params.email);
        expect(checkUser.phone).to.equal(params.phone);
        expect(checkUser.passwordResetExpire).to.not.be.null;
        expect(checkUser.loginCount).to.equal(0);
        expect(checkUser.lastLogin).to.be.null;
        expect(checkUser.createdAt).to.not.be.null;
        expect(checkUser.updatedAt).to.not.be.null;
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to create user

    it('[logged-out] should not create new user if passwords format is invalid', async () => {
      try {
        const params = {
          firstName: 'First',
          lastName: 'Last',
          active: true,
          email: 'new-user@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword',
          password2: 'thisisapassword',
          acceptedTerms: true
        };

        // create user request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, i18n.__('USER[Invalid Password Format]')));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should not create new user if passwords format is invalid

    it('[logged-out] should not create new user if passwords are not the same', async () => {
      try {
        const params = {
          firstName: 'First',
          lastName: 'Last',
          active: true,
          email: 'new-user@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword2F%',
          acceptedTerms: true
        };

        // create user request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_PASSWORDS_NOT_EQUAL));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should not create new user if passwords are not the same

    it('[logged-out] should not create new user if acceptedTerms is false', async () => {
      try {
        const params = {
          firstName: 'First',
          lastName: 'Last',
          active: true,
          email: 'new-user@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: false
        };

        // create user request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should not create new user if acceptedTerms is false

    it('[logged-out] should not create new user if email already exists', async () => {
      try {
        const params = {
          firstName: 'John',
          lastName: 'Doe',
          active: true,
          email: 'user-1@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };

        // create user request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_USER_ALREADY_EXISTS));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should not create new user if email already exists

    it('[logged-out] should not create new user if timezone is invalid', async () => {
      try {
        const params = {
          firstName: 'First',
          lastName: 'Last',
          active: true,
          email: 'new-user@example.com',
          phone: '+12406206950',
          timezone: 'invalid-timezone',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };

        // create user request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_INVALID_TIMEZONE));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should not create new user if timezone is invalid
  }); // END Role: Logged Out
}); // END User.V1Create
