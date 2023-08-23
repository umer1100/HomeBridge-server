/**
 * LENDER ERROR
 *
 * For Better Client 4xx Error Handling For Lender Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Lender Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend LENDER to the key and error value  */
  // LENDER_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'LENDER.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['LENDER[Account is not active]']
  // }
};

module.exports = LOCAL_ERROR_CODES;
