/**
 * SESSION HELPER
 */

'use strict';

module.exports = {
  isSessionVerified,
  destroyExpiredAuthToken,
}

// models
const models = require('../../models');

/**
 * isSessionVerified
 *
 * @param authToken
 * @returns true if current user session exists
 */
async function isSessionVerified( authToken ) {
  try {
    const findSession = await models.session.findOne({
      where: {
        jwt: authToken
      }
    });

    return findSession ? true : false;
  } catch (error) {
    return Promise.reject( error?.message || error );
  }
}

/**
 * destroyExpiredAuthToken
 *
 * @param authToken
 * @returns true if session successfully destroyed
 */
async function destroyExpiredAuthToken( authToken ) {
  try {
    const response = await models.session.destroy({
      where: {
        jwt: authToken
      }
    });

    return response == 1 ? true : false;
  } catch (error) {
    return Promise.reject( error?.message || error );
  }
}
