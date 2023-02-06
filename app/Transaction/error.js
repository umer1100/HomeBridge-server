/**
 * TRANSACTION ERROR
 *
 * For Better Client 4xx Error Handling For Transaction Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Transaction Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend TRANSACTION to the key and error value  */
  // TRANSACTION_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'TRANSACTION.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['TRANSACTION[Account is not active]']
  // }
};

module.exports = LOCAL_ERROR_CODES;
