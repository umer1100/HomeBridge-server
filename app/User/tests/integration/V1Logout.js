/**
 * TEST USER V1Logout METHOD
 */

'use strict';

// build-in node modules
const path = require('path');

// load test env
require('dotenv').config({ path: path.join(__dirname, '../../../../config/.env.test') });



// server & models
const app = require('../../../../server');
const models = require('../../../../models');

// assertion library
const { expect } = require('chai');
const request = require('supertest');


// helpers
const { userLogin, reset, populate } = require('../../../../helpers/tests');

describe('User.V1Logout', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/users';
  const routeMethod = '/logout';
  const routeUrl = `${routeVersion}${routePrefix}${routeMethod}`;

  // clear database
  beforeEach(async () => {
    await reset().catch(err => { console.error(err); throw err; });
  });

  // Role: User
  describe('Role: User', async () => {
    const jwt = 'jwt-user';

    // populate database with fixtures and empty queues
    beforeEach(async () => {
      try {
        await populate('fix1');
      } catch (error) {
        console.error(error);
        throw err;
      }
    });
    it('[user] remove user session', async () => {
      const user1 = userFix[0]; // grab user from fixtures
      try {
        const { token } = await userLogin(app, routeVersion, request, user1);

        const loggedInSessionData = await models.session.findOne({
          where: {
            jwt: token
          }
        })
        expect(loggedInSessionData.jwt).to.equal(token)

        const res = await request(app)
          .post(routeUrl)
          .set('authorization', `${jwt} ${token}`)
          .send({});
        expect(res.body).to.have.property('status', 200);
        expect(res.body).to.have.property('success', true);

        const loggedOutSessionData = await models.session.findOne({
          where: {
            jwt: token
          }
        })
        expect(loggedOutSessionData).to.equal(null)
      } catch (error) {
        console.error(error);
        throw error;
      }
    }); // END remove user session
  }); // END Role: All User
}); // END User.V1Logout
