/**
 * TEST USER V1Read METHOD
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
const { adminLogin, userLogin, reset, populate } = require('../../../../helpers/tests');

describe('User.V1Read', async () => {
  // grab fixtures here
  const adminFix = require('../../../../test/fixtures/fix1/admin');
  const userFix = require('../../../../test/fixtures/fix1/user');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/users';
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
    }); // END [logged-out] should fail to read user
  }); // END Role: Logged Out

  // User can read himself
  describe('Role: User all roles', async () => {
    const jwt = 'jwt-user';
    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[Guest] should read himself', async () => {
      const guest = userFix[4];

      try {
        const { token, response } = await userLogin(app, routeVersion, request, guest);
        expect(response.body.user.roleType).to.equal('GUEST');

        // read user request
        const res = await request(app).get(`${routeUrl}?id=${guest.id}`).set('authorization', `${jwt} ${token}`);
        expect(res.statusCode).to.equal(200);
      } catch (error) {
        throw error;
      }
    }); // END [Guest] should read himself

    it('[Employer] should read himself', async () => {
      const employer = userFix[0];

      try {
        const { token, response } = await userLogin(app, routeVersion, request, employer);
        expect(response.body.user.roleType).to.equal('EMPLOYER');

        // read user request
        const res = await request(app).get(`${routeUrl}?id=${employer.id}`).set('authorization', `${jwt} ${token}`);
        expect(res.statusCode).to.equal(200);
      } catch (error) {
        throw error;
      }
    }); // [Employer] should read himself

    it('[Employee] should read himself', async () => {
      const employee = userFix[3];

      try {
        const { token, response } = await userLogin(app, routeVersion, request, employee);
        expect(response.body.user.roleType).to.equal('EMPLOYEE');

        // read user request
        const res = await request(app).get(`${routeUrl}?id=${employee.id}`).set('authorization', `${jwt} ${token}`);
        expect(res.statusCode).to.equal(200);
      } catch (error) {
        throw error;
      }
    }); // [Employee] should read himself

    it('[Manager] should read himself', async () => {
      const manager = userFix[2];

      try {
        const { token, response } = await userLogin(app, routeVersion, request, manager);
        expect(response.body.user.roleType).to.equal('MANAGER');

        // read user request
        const res = await request(app).get(`${routeUrl}?id=${manager.id}`).set('authorization', `${jwt} ${token}`);
        expect(res.statusCode).to.equal(200);
      } catch (error) {
        throw error;
      }
    }); // END [Manager] should read himself

    it('[Any] should read themselves by default', async () => {
      const manager = userFix[2];

      try {
        const { token, response } = await userLogin(app, routeVersion, request, manager);
        expect(response.body.user.roleType).to.equal('MANAGER');

        // read user request
        const res = await request(app).get(`${routeUrl}`).set('authorization', `${jwt} ${token}`);
        expect(res.statusCode).to.equal(200);
        expect(res.body.data.id).to.equal(manager.id);
      } catch (error) {
        throw error;
      }
    }); // END [Any] should read themselves by default
  }); // END Role: all roles

  // Admin
  describe('Role: Admin', async () => {
    const jwt = 'jwt-admin';

    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[admin] should read an user', async () => {
      const admin1 = adminFix[0];
      const user1 = userFix[0];
      try {
        // login admin
        const { token } = await adminLogin(app, routeVersion, request, admin1);

        // read user request
        const res = await request(app).get(`${routeUrl}?id=${user1.id}`).set('authorization', `${jwt} ${token}`);

        expect(res.statusCode).to.equal(200);
        expect(res.body.user.id).to.equal(1);
        expect(res.body.user.firstName).to.equal('John');
        expect(res.body.user.lastName).to.equal('Doe');
        expect(res.body.user.roleType).to.equal('EMPLOYER');
        expect(res.body.user.email).to.equal('user-1@example.com');
        expect(res.body.user.organizationId).to.equal(1);
      } catch (error) {
        throw error;
      }
    }); // [admin] should read an user
  }); // END Role: Admin

  // Employer
  describe('Role: Employer', async () => {
    const jwt = 'jwt-user';
    const employer = userFix[0];

    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[employer] should read an user under same organization', async () => {
      const employee = userFix[3];

      try {
        // login employer
        const { token, response } = await userLogin(app, routeVersion, request, employer);

        expect(response.body.user.roleType).to.equal('EMPLOYER');
        expect(response.body.user.organizationId).to.equal(1);
        expect(employee.organizationId).to.equal(1);

        // read user request
        const res = await request(app).get(`${routeUrl}?id=${employee.id}`).set('authorization', `${jwt} ${token}`);

        expect(res.statusCode).to.equal(200);
        expect(res.body.data.id).to.equal(4);
        expect(res.body.data.firstName).to.equal('Gorang');
        expect(res.body.data.lastName).to.equal('Pall');
        expect(res.body.data.roleType).to.equal('EMPLOYEE');
        expect(res.body.data.email).to.equal('user-4@example.com');
        expect(res.body.data.organizationId).to.equal(1);
      } catch (error) {
        throw error;
      }
    }); // [employer] should read an user under same organization

    it('[employer] should not read an user under different organization', async () => {
      const employee = userFix[4];

      try {
        // login employer
        const { token, response } = await userLogin(app, routeVersion, request, employer);

        expect(response.body.user.roleType).to.equal('EMPLOYER');
        expect(response.body.user.organizationId).to.equal(1);
        expect(employee.organizationId).to.equal(2);

        // read user request
        const res = await request(app).get(`${routeUrl}?id=${employee.id}`).set('authorization', `${jwt} ${token}`);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // [employer] should not read an user under different organization
  }); // END Role: Employer

  // Role: other than Employer
  describe('Role: other then Employer', async () => {
    const jwt = 'jwt-user';
    const employee = userFix[3];

    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[Role: Guest] should fail to read organizational users', async () => {
      const guest = userFix[4];

      try {
        // login guest
        const { token, response } = await userLogin(app, routeVersion, request, guest);
        expect(response.body.user.roleType).to.equal('GUEST');

        const res = await request(app).get(`${routeUrl}?id=${employee.id}`).set('authorization', `${jwt} ${token}`);

        expect(res.statusCode).to.equal(401);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.UNAUTHORIZED));
      } catch (error) {
        throw error;
      }
    }); // END [Role: Guest] should fail to read users
  }); // END Role: other then Employer
}); // END User.V1Read
