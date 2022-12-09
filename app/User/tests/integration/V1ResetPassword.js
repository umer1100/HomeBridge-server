/**
 * TEST USER V1ResetPassword METHOD
 */

'use strict';

// build-in node modules
const path = require('path');

// load test env
require('dotenv').config({ path: path.join(__dirname, '../../../../config/.env.test') });

// third party
const i18n = require('i18n'); // https://github.com/mashpie/i18n-node
const bcrypt = require('bcrypt');

// server & models
const app = require('../../../../server');
const { user } = require('../../../../models');

// assertion library
const { expect } = require('chai');
const request = require('supertest');

// services

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

    it('[user] should reset password successfully', async () => {
      const user1 = userFix[0];
      try {
        const resetPasswordParams = {
          email:  user1.email
        }

        const resetPasswordRes = await request(app)
        .post('/v1/users/send-reset-password-token')
        .send(resetPasswordParams)

        expect(resetPasswordRes.statusCode).to.equal(200);

        const findUser = await user.findByPk(user1.id);
        const params = {
          password1: 'NEWPASSWORD1f%',
          password2: 'NEWPASSWORD1f%',
          passwordResetToken: findUser.passwordResetToken
        }

        // user password update request
        const res = await request(app)
          .post(routeUrl)
          .send(params)

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('success', true);

        const foundUser = await user.findByPk(user1.id);
        // check if password is new
        expect(foundUser.password).to.equal(bcrypt.hashSync(params.password1, foundUser.salt));
      } catch (error) {
        throw error;
      }
    }); // END [user] should reset password successfully

    it('[user] should fail to reset password if password1 and password2 are not the same', async () => {
      const user1 = userFix[0];
      try {
        const resetPasswordParams = {
          email:  user1.email
        }

        const resetPasswordRes = await request(app)
        .post('/v1/users/send-reset-password-token')
        .send(resetPasswordParams)

        expect(resetPasswordRes.statusCode).to.equal(200);

        const findUser = await user.findByPk(user1.id);
        const params = {
          password1: 'NEWPASSWORD1f%',
          password2: 'NEWPASSWORD2f%',
          passwordResetToken: findUser.passwordResetToken
        };

        // call update password
        const res = await request(app)
          .post(routeUrl)
          .send(params);

        expect(res.statusCode).to.equal(400);
      } catch (error) {
        throw error;
      }
    }); // END [user] should fail to update password if password1 and password2 are not the same
  }); // END Role: Logged Out
}); // END User.V1UpdatePassword
