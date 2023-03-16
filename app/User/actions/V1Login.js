/**
 * USER V1Login ACTION
 */

'use strict';

// ENV variables
const { USER_WEB_HOST, TOKEN_EXPIRATION_TIME } = process.env;

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
 * Login an user
 *
 * GET  /v1/users/login
 * POST /v1/users/login
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *   @email - (STRING - REQUIRED): The email of the user,
 *   @password - (STRING - REQUIRED): The unhashed password of the user
 * }
 *
 * Success: Return an user and JWT token.
 * Errors:
 *   400: USER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS
 *   400: USER_BAD_REQUEST_ACCOUNT_INACTIVE
 *   400: USER_BAD_REQUEST_ACCOUNT_DELETED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Login(req, res) {
  // need to wrap in promise because of the passport.authenticate callback
  return new Promise((resolve, reject) => {
    // login user WITHOUT SESSION
    passport.authenticate('JWTUserLogin', { session: false }, async (err, user, info) => {
      if (err) return reject(err);

      // check if user exists
      if (!user) return resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS));

      // return error message if user is inactive
      if (user.status === 'INACTIVE') return resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_INACTIVE));

      // return error message if user's emailConfirmed is false
      if (!user.emailConfirmed || user.status === 'PENDING') return resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_EMAIL_CONFIRMATION_PENDING));

      // return error message if user is deleted
      if (user.deletedAt) return resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_DELETED));

      // update login count and last login
      try {
        await models.user.update(
          {
            loginCount: user.loginCount + 1,
            lastLogin: moment.tz('UTC')
          },
          {
            where: {
              id: user.id
            }
          }
        );

        // find user
        const updatedUser = await models.user.findByPk(user.id, {
          attributes: {
            exclude: models.user.getSensitiveData() // remove sensitive data
          },
          include: {
            model: models.organization,
            attributes: ['name', 'url', 'spendLimit']
          }
        });

        // return success
        return resolve({
          status: 201,
          success: true,
          token: createJwtToken(updatedUser, USER_WEB_HOST, TOKEN_EXPIRATION_TIME),
          user: updatedUser.dataValues
        });
      } catch (error) {
        return reject(error);
      }
    })(req, res, null);
  }); // END Promise
} // END V1Login
