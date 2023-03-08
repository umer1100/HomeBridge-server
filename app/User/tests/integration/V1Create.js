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

const organizationFix = require('../../../../test/fixtures/fix1/organization');

// services
const { errorResponse, ERROR_CODES } = require('../../../../services/error');

// helpers
const { userLogin, reset, populate } = require('../../../../helpers/tests');
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
      const organization = organizationFix[0];

      try {
        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          organizationId: organization.id,
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(201);
        expect(res.body.user.id).to.equal(user.length + 1);
        expect(res.body.user.status).to.equal('PENDING');
        expect(res.body.user.name).to.equal(params.name);
        expect(res.body.user.email).to.equal(params.email);
        expect(res.body.user.loginCount).to.equal(0);
        expect(res.body.user.lastLogin).to.be.null;
        expect(res.body.user.createdAt).to.be.a('string');
        expect(res.body.user.updatedAt).to.be.a('string');

        // check if user was created
        const checkUser = await models.user.findByPk(res.body.user.id);
        expect(checkUser.name).to.equal(params.name);
        expect(checkUser.status).to.equal('PENDING');
        expect(checkUser.name).to.equal(params.name);
        expect(checkUser.email).to.equal(params.email);
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
        const organization = organizationFix[0];

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          password1: 'thisisapassword',
          password2: 'thisisapassword',
          organizationId: organization.id,
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
      const organization = organizationFix[0];
      try {
        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword2F%',
          organizationId: organization.id,
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
      const organization = organizationFix[0];
      try {
        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword2F%',
          organizationId: organization.id,
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
        const organization = organizationFix[0];
        const params = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'user-1@example.com',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          organizationId: organization.id,
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

  }); // END Role: Logged Out

  // Role: User
  describe('Role: Logged in', async () => {
    const jwt = 'jwt-user';

    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[user] with roleType EMPLOYER should not create user with roleType EMPLOYER', async () => {
      // Grab an user with role EMPLOYER
      const employerUser = await models.user.findOne({ where: { roleType: 'EMPLOYER' } });
      const user1 = userFix[employerUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          phone: '+12406206950',
          roleType: 'EMPLOYER',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType EMPLOYER should not create user with roleType EMPLOYER

    it('[user] with roleType EMPLOYER should create user with roleType ADMIN successfully', async () => {
      // Grab an user with role EMPLOYER
      const employerUser = await models.user.findOne({ where: { roleType: 'EMPLOYER' } });
      const user1 = userFix[employerUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          phone: '+12406206950',
          roleType: 'ADMIN',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(201);
        expect(res.body.user.id).to.equal(user.length + 1);
        expect(res.body.user.timezone).to.equal(params.timezone);
        expect(res.body.user.locale).to.equal(params.locale);
        expect(res.body.user.status).to.equal('PENDING');
        expect(res.body.user.name).to.equal(params.name);
        expect(res.body.user.email).to.equal(params.email);
        expect(res.body.user.phone).to.equal(params.phone);
        expect(res.body.user.roleType).to.equal(params.roleType);
        expect(res.body.user.organizationId).to.equal(1);
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
        expect(checkUser.status).to.equal('PENDING');
        expect(checkUser.name).to.equal(params.name);
        expect(checkUser.email).to.equal(params.email);
        expect(checkUser.phone).to.equal(params.phone);
        expect(checkUser.roleType).to.equal(params.roleType);
        expect(checkUser.passwordResetExpire).to.not.be.null;
        expect(checkUser.loginCount).to.equal(0);
        expect(checkUser.lastLogin).to.be.null;
        expect(checkUser.createdAt).to.not.be.null;
        expect(checkUser.updatedAt).to.not.be.null;
      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType EMPLOYER should create user with roleType ADMIN successfully

    it('[user] with roleType EMPLOYER should create user with roleType EMPLOYEE successfully', async () => {
      // Grab an user with role EMPLOYER
      const employerUser = await models.user.findOne({ where: { roleType: 'EMPLOYER' } });
      const user1 = userFix[employerUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          phone: '+12406206950',
          roleType: 'EMPLOYEE',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(201);
        expect(res.body.user.id).to.equal(user.length + 1);
        expect(res.body.user.timezone).to.equal(params.timezone);
        expect(res.body.user.locale).to.equal(params.locale);
        expect(res.body.user.status).to.equal('PENDING');
        expect(res.body.user.name).to.equal(params.name);
        expect(res.body.user.email).to.equal(params.email);
        expect(res.body.user.phone).to.equal(params.phone);
        expect(res.body.user.roleType).to.equal(params.roleType);
        expect(res.body.user.organizationId).to.equal(1);
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
        expect(checkUser.status).to.equal('PENDING');
        expect(checkUser.name).to.equal(params.name);
        expect(checkUser.email).to.equal(params.email);
        expect(checkUser.phone).to.equal(params.phone);
        expect(checkUser.roleType).to.equal(params.roleType);
        expect(checkUser.passwordResetExpire).to.not.be.null;
        expect(checkUser.loginCount).to.equal(0);
        expect(checkUser.lastLogin).to.be.null;
        expect(checkUser.createdAt).to.not.be.null;
        expect(checkUser.updatedAt).to.not.be.null;
      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType EMPLOYER should create user with roleType EMPLOYEE successfully

    it('[user] with roleType EMPLOYER should not create user with roleType EMPLOYEE with missing required argument', async () => {
      // Grab an user with role EMPLOYER
      const employerUser = await models.user.findOne({ where: { roleType: 'EMPLOYER' } });
      const user1 = userFix[employerUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.equal(ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS.error);

      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType EMPLOYER should not create user with roleType EMPLOYEE with missing required argument

    it('[user] with roleType EMPLOYER should not create user with roleType EMPLOYEE with incorrect email address', async () => {
      // Grab an user with role EMPLOYER
      const employerUser = await models.user.findOne({ where: { roleType: 'EMPLOYER' } });
      const user1 = userFix[employerUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user.com',
          phone: '+12406206950',
          roleType: 'EMPLOYEE',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request

        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('"email" must be a valid email');

      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType EMPLOYER should not create user with roleType EMPLOYEE with incorrect email address

    it('[user] with roleType ADMIN should not create user with roleType EMPLOYER', async () => {
      // Grab an user with role ADMIN
      const adminUser = await models.user.findOne({ where: { roleType: 'ADMIN' } });
      const user1 = userFix[adminUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          phone: '+12406206950',
          roleType: 'EMPLOYER',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType ADMIN should not create user with roleType EMPLOYER

    it('[user] with roleType ADMIN should not create user with roleType ADMIN', async () => {
      // Grab an user with role ADMIN
      const adminUser = await models.user.findOne({ where: { roleType: 'ADMIN' } });
      const user1 = userFix[adminUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          phone: '+12406206950',
          roleType: 'ADMIN',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType ADMIN should not create user with roleType ADMIN



    it('[user] with roleType EMPLOYEE should not create user with roleType EMPLOYER', async () => {
      // Grab an user with role EMPLOYEE
      const employeeUser = await models.user.findOne({ where: { roleType: 'EMPLOYEE' } });
      const user1 = userFix[employeeUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          phone: '+12406206950',
          roleType: 'EMPLOYER',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType EMPLOYEE should not create user with roleType EMPLOYER

    it('[user] with roleType EMPLOYEE should not create user with roleType ADMIN', async () => {
      // Grab an user with role EMPLOYEE
      const employeeUser = await models.user.findOne({ where: { roleType: 'EMPLOYEE' } });
      const user1 = userFix[employeeUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          phone: '+12406206950',
          roleType: 'ADMIN',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType EMPLOYEE should not create user with roleType ADMIN


    it('[user] with roleType EMPLOYEE should not create user with roleType EMPLOYEE', async () => {
      // Grab an user with role EMPLOYEE
      const employeeUser = await models.user.findOne({ where: { roleType: 'EMPLOYEE' } });
      const user1 = userFix[employeeUser.id - 1];

      // login params
      const params = {
        email: user1.email,
        password: user1.password
      };

      try {
        // login user
        const { token } = await userLogin(app, routeVersion, request, user1);

        const params = {
          firstName: 'First',
          lastName: 'Last',
          email: 'new-user@example.com',
          phone: '+12406206950',
          roleType: 'EMPLOYEE',
          organizationId: user1.organizationId,
          timezone: 'America/Los_Angeles',
          locale: 'en',
          password1: 'thisisapassword1F%',
          password2: 'thisisapassword1F%',
          acceptedTerms: true
        };
        // create user request
        const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [user] with roleType EMPLOYEE should not create user with roleType EMPLOYEE
  }); // END ROLE: logged in
}); // END User.V1Create
