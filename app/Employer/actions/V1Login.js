/**
 * EMPLOYER V1Login ACTION
 */

'use strict';

// ENV variables
const { EMPLOYER_WEB_HOST } = process.env;

// third-party
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/
const passport = require('passport'); // handle authentication: http://www.passportjs.org/docs/

// services
const { ERROR_CODES, errorResponse } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers
const { createJwtToken } = require('../../../helpers/logic');

// methods
module.exports = {
  V1Login
};

/**
 * Login an employer
 *
 * GET  /v1/employers/login
 * POST /v1/employers/login
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *   @email - (STRING - REQUIRED): The email of the employer,
 *   @password - (STRING - REQUIRED): The unhashed password of the employer
 * }
 *
 * Success: Return an employer and JWT token.
 * Errors:
 *   400: EMPLOYER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS
 *   400: EMPLOYER_BAD_REQUEST_ACCOUNT_INACTIVE
 *   400: EMPLOYER_BAD_REQUEST_ACCOUNT_DELETED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Login(req, res) {
  // need to wrap in promise because of the passport.authenticate callback

  return new Promise((resolve, reject) => {
    // login employer WITHOUT SESSION
    passport.authenticate('JWTEmployerLogin', { session: false }, async (err, employer, info) => {
      if (err) return reject(err);
      // check if employer exists
      if (!employer) return resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS));

      // return error message if employer is inactive
      if (!employer.active) return resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_ACCOUNT_INACTIVE));

      // return error message if employer is deleted
      if (employer.deletedAt) return resolve(errorResponse(req, ERROR_CODES.EMPLOYER_BAD_REQUEST_ACCOUNT_DELETED));

      // update login count and last login
      try {
        await models.employer.update(
          {
            loginCount: employer.loginCount + 1,
            lastLogin: moment.tz('UTC')
          },
          {
            where: {
              id: employer.id
            }
          }
        );

        // find employer
        const updatedEmployer = await models.employer.findByPk(employer.id, {
          attributes: {
            exclude: models.employer.getSensitiveData() // remove sensitive data
          }
        });

        // return success
        return resolve({
          status: 201,
          success: true,
          token: createJwtToken(updatedEmployer, EMPLOYER_WEB_HOST),
          employer: updatedEmployer.dataValues
        });
      } catch (error) {
        return reject(error);
      }
    })(req, res, null);
  }); // END Promise
} // END V1Login
