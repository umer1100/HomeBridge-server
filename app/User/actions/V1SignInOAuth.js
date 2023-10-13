/**
 * USER V1SignInOAuth ACTION
 */

'use strict';

const joi = require('@hapi/joi');
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

const models = require('../../../models.js');
const { createJwtToken } = require('../../../helpers/logic.js');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error.js');
const { getUserInfo } = require('../../../services/oauth.js');
const { STATUS, MESSAGE } = require('../../../helpers/constants.js');
const { USER_WEB_HOST, TOKEN_EXPIRATION_TIME } = process.env;

module.exports = {
  V1SignInOAuth
};

/**
 * Sign Up as an employer
 *
 * POST /v1/users/signIn/oauth
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *  @code - (STRING - REQUIRED): The first name of the employer
 * }
 *
 * Success: returns user object
 * Errors:
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1SignInOAuth(req, res) {
  const joiObject = joi.object({
    code: joi.string().trim().min(1).required()
  });

  const { error, value } = joiObject.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

  req.args = value;
  const { code } = req.args;

  try {
    const userResponse = await getUserInfo(code);
    const { email } = userResponse.data;
    const user = await models.user.findOne({
      where: {
        email
      },
      include: {
        model: models.organization,
        attributes: ['name', 'url', 'spendLimit']
      }
    });
    if (!user) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS));

    if (user.status === STATUS.INACTIVE) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_INACTIVE));

    await user.update({
      loginCount: user.loginCount + 1,
      lastLogin: moment.tz('UTC')
    });

    const jwtExpiration = new Date().getTime() + parseInt(TOKEN_EXPIRATION_TIME) * 60 * 1000;
    const token = createJwtToken(user, USER_WEB_HOST, jwtExpiration);
    await user.createSession({ jwt: token, expirationAt: jwtExpiration });

    return Promise.resolve({
      status: 201,
      success: true,
      user: user.dataValues,
      message: MESSAGE.LOGIN_SUCCESSFULLY,
      token
    });
  } catch (error) {
    console.error('Token exchange failed: ', error?.message);
    return Promise.reject(error);
  }
} // END V1SignInOAuth
