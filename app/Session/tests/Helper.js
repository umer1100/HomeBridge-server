/**
 * Test helper.test.js Helper
 */

'use strict';

const path = require('path');

// load test env
require('dotenv').config({ path: path.join(__dirname, '../../../config/.env.test') });

// env variables
const { USER_WEB_HOST, TOKEN_EXPIRATION_TIME } = process.env;

// assertion library
const { expect } = require('chai');

// helpers
const { reset, populate } = require('../../../helpers/tests');
const helper = require('../helper');
const { createJwtToken } = require('../../../helpers/logic');

const models = require('../../../models');

const userFix = require('../../../test/fixtures/fix1/user');

describe('Helpers.js', async () => {
  let session = null

  beforeEach(async () => {
    try {
      await reset();
      await populate('fix1');

      const jwtExpiration = new Date().getTime() + parseInt(TOKEN_EXPIRATION_TIME) * 60 * 1000
      const token = createJwtToken(userFix[1], USER_WEB_HOST, jwtExpiration)

      const user = await models.user.findOne({
        where: { status: "ACTIVE" }
      })

      session = await user.createSession({ jwt: token, expirationAt: jwtExpiration });
    } catch (error) {
      console.log(error.message)
    }
  });

  // isSessionVerified
  describe('isSessionVerified', async () => {
    it('should return true if session verified', async () => {
      try {
        const response = await helper.isSessionVerified(session.jwt)
        expect(response).to.be.true
      } catch (error) {
        console.error(error);
        throw error;
      }
    }); // END should return true if session verified

    it('should return false if session is not verified', async () => {
      try {
        const response = await helper.isSessionVerified("abc")
        expect(response).to.be.false
      } catch (error) {
        console.error(error);
        throw error;
      }
    }); // END should return false if session is not verified
  }); // END isSessionVerified

  //destroy expire token
  describe('Destroy Expire Token', async () => {
    it('should return true after destroy expired jwt token', async () => {
      try {
        const response = await helper.destroyExpiredAuthToken(session.jwt)
        expect(response).to.be.true
      } catch (error) {
        console.error(error);
        throw error;
      }
    }); // END should return true after destroy expired jwt token
  })//END destroy expire token
}); // END Helpers.js
