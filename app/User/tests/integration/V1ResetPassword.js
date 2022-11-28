/**
 * TEST USER V1ResetPassword METHOD
 */

'use strict';

// build-in node modules
const path = require('path');

// load test env
require('dotenv').config({ path: path.join(__dirname, '../../../../config/.env.test') });

// ENV variables
const { WEB_HOSTNAME } = process.env;

// third party
const i18n = require('i18n'); // https://github.com/mashpie/i18n-node

// server & models
const app = require('../../../../server');
const { user } = require('../../../../models');

// assertion library
const { expect } = require('chai');
const request = require('supertest');

// services
const { errorResponse, ERROR_CODES } = require('../../../../services/error');

// helpers
const { reset, populate } = require('../../../../helpers/tests');

describe('User.V1ResetPassword', async () => {
  // grab fixtures here
  const userFix = require('../../../../test/fixtures/fix1/user');

  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/users';
  const routeMethod = '/reset-password';
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

    it('[logged-out] should call reset password successfully', async () => {
      const user1 = userFix[0];
      const params = {
        email: user1.email
      };

      try {
        // send reset request
        const res = await request(app).post(routeUrl).send(params);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('success', true);

        // check if resetPassword, passwordResetToken, passwordResetExpire are there
        const foundUser = await user.findByPk(user1.id);
        expect(foundUser.passwordResetToken).to.be.a('string').with.lengthOf.at.least(64);
        expect(foundUser.passwordResetExpire).to.not.be.null;

        // check reset link
        expect(res.body).to.have.property('resetLink', `${WEB_HOSTNAME}/UpdatePassword?passwordResetToken=${foundUser.passwordResetToken}`);
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should call reset password successfully

    it('[logged-out] should fail to call reset password because email does not exist', async () => {
      const params = {
        email: 'noemail@email.com'
      };

      try {
        // send reset request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(404);
        expect(res.body).to.deep.equal(errorResponse(i18n, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));
      } catch (error) {
        throw error;
      }
    }); // END [logged-out] should fail to call reset password because email does not exist
  }); // END Role: Logged Out
}); // END User.V1ResetPassword
