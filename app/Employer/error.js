/**
 * EMPLOYER ERROR
 *
 * For Better Client 4xx Error Handling For Employer Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Employer Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend EMPLOYER to the key and error value  */
  // EMPLOYER_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'EMPLOYER.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['EMPLOYER[Account is not active]']
  // }

  // V1Login
  EMPLOYER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS: {
    error: 'EMPLOYER.BAD_REQUEST_INVALID_LOGIN_CREDENTIALS',
    status: 400,
    messages: ['EMPLOYER[Invalid Login Credentials]']
  },

  EMPLOYER_BAD_REQUEST_ACCOUNT_INACTIVE: {
    error: 'EMPLOYER.BAD_REQUEST_ACCOUNT_INACTIVE',
    status: 400,
    messages: ['EMPLOYER[Admin Account Inactive]']
  },

  EMPLOYER_BAD_REQUEST_ACCOUNT_DELETED: {
    error: 'EMPLOYER.BAD_REQUEST_ACCOUNT_DELETED',
    status: 400,
    messages: ['EMPLOYER[Admin Account Deleted]']
  },

  // V1Create
  EMPLOYER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED: {
    error: 'EMPLOYER.BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED',
    status: 400,
    messages: ['EMPLOYER[Terms of Service Not Accepted]']
  },

  EMPLOYER_BAD_REQUEST_EMPLOYER_ALREADY_EXISTS: {
    error: 'EMPLOYER.BAD_REQUEST_EMPLOYER_ALREADY_EXISTS',
    status: 400,
    messages: ['EMPLOYER[Admin Already Exists]']
  },

  EMPLOYER_BAD_REQUEST_INVALID_TIMEZONE: {
    error: 'EMPLOYER.BAD_REQUEST_INVALID_TIMEZONE',
    status: 400,
    messages: ['EMPLOYER[Invalid Time Zone]']
  },

  // V1ConfirmPassword
  EMPLOYER_BAD_REQUEST_INVALID_PASSWORD_RESET_TOKEN: {
    error: 'EMPLOYER.BAD_REQUEST_INVALID_PASSWORD_RESET_TOKEN',
    status: 400,
    messages: ['EMPLOYER[Invalid Password Reset Token]']
  },

  EMPLOYER_BAD_REQUEST_PASSWORDS_NOT_EQUAL: {
    error: 'EMPLOYER.BAD_REQUEST_PASSWORDS_NOT_EQUAL',
    status: 400,
    messages: ['EMPLOYER[Passwords Not Equal]']
  },

  // V1Read
  EMPLOYER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST: {
    error: 'EMPLOYER.BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST',
    status: 404,
    messages: ['EMPLOYER[EMPLOYER Account Does Not Exist]']
  }
};

module.exports = LOCAL_ERROR_CODES;
