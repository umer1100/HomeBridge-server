/**
 * PLAIDACCOUNT ERROR
 *
 * For Better Client 4xx Error Handling For PlaidAccount Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * PLAIDACCOUNT Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend PLAIDACCOUNT to the key and error value  */
  // PLAIDACCOUNT_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'PLAIDACCOUNT.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['PLAIDACCOUNT[PlaidAccount is not active]']
  // }

  PLAIDACCOUNT_BAD_REQUEST_PLAIDACCOUNT_DOES_NOT_EXIST: {
    error: 'PLAIDACCOUNT.BAD_REQUEST_PLAIDACCOUNT_DOES_NOT_EXIST',
    status: 404,
    messages: ['PLAIDACCOUNT[PlaidAccount does not exist]']
  }
};

module.exports = LOCAL_ERROR_CODES;
