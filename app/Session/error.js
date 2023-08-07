/**
 * SESSION ERROR
 *
 * For Better Client 4xx Error Handling For Session Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Session Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend SESSION to the key and error value  */
  // SESSION_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'SESSION.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['SESSION[Account is not active]']
  // }
};

module.exports = LOCAL_ERROR_CODES;
