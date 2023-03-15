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
  ACCOUNT_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST: {
    error: 'ACCOUNT.BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST',
    status: 404,
    messages: ['ACCOUNT[Dwolla account does not exist]']
  },

  TRANSACTIONS_BAD_REQUEST_TRANSACTIONS_DOES_NOT_EXIST: {
    error: 'TRANSACTIONS.BAD_REQUEST_TRANSACTIONS_DOES_NOT_EXIST',
    status: 404,
    messages: ['TRANSACTION[Transaction does not exist]']
  },
};

module.exports = LOCAL_ERROR_CODES;
