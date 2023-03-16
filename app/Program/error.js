/**
 * PROGRAM ERROR
 *
 * For Better Client 4xx Error Handling For Program Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Program Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend PROGRAM to the key and error value  */
  // PROGRAM_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'PROGRAM.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['PROGRAM[Account is not active]']
  // }

  // V1Read
  PROGRAM_BAD_REQUEST_PROGRAM_DOES_NOT_EXIST: {
    error: 'PROGRAM.BAD_REQUEST_PROGRAM_DOES_NOT_EXIST',
    status: 404,
    messages: ['PROGRAM[PROGRAM Does Not Exist]']
  }
};

module.exports = LOCAL_ERROR_CODES;
