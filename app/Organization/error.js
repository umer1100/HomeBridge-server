/**
 * ORGANIZATION ERROR
 *
 * For Better Client 4xx Error Handling For Organization Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Organization Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend ORGANIZATION to the key and error value  */
  // ORGANIZATION_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'ORGANIZATION.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['ORGANIZATION[Account is not active]']
  // }

  // V1Login
  ORGANIZATION_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS: {
    error: 'ORGANIZATION.BAD_REQUEST_INVALID_LOGIN_CREDENTIALS',
    status: 400,
    messages: ['ORGANIZATION[Invalid Login Credentials]']
  },

  ORGANIZATION_BAD_REQUEST_ACCOUNT_INACTIVE: {
    error: 'ORGANIZATION.BAD_REQUEST_ACCOUNT_INACTIVE',
    status: 400,
    messages: ['ORGANIZATION[Organization Account Inactive]']
  },

  ORGANIZATION_BAD_REQUEST_ACCOUNT_DELETED: {
    error: 'ORGANIZATION.BAD_REQUEST_ACCOUNT_DELETED',
    status: 400,
    messages: ['ORGANIZATION[Organization Account Deleted]']
  },

  // V1Create
  ORGANIZATION_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED: {
    error: 'ORGANIZATION.BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED',
    status: 400,
    messages: ['ORGANIZATION[Terms of Service Not Accepted]']
  },

  ORGANIZATION_BAD_REQUEST_ORGANIZATION_ALREADY_EXISTS: {
    error: 'ORGANIZATION.BAD_REQUEST_ORGANIZATION_ALREADY_EXISTS',
    status: 400,
    messages: ['ORGANIZATION[Organization Already Exists]']
  },

  ORGANIZATION_BAD_REQUEST_INVALID_TIMEZONE: {
    error: 'ORGANIZATION.BAD_REQUEST_INVALID_TIMEZONE',
    status: 400,
    messages: ['ORGANIZATION[Invalid Time Zone]']
  },

  // V1ConfirmPassword
  ORGANIZATION_BAD_REQUEST_INVALID_PASSWORD_RESET_TOKEN: {
    error: 'ORGANIZATION.BAD_REQUEST_INVALID_PASSWORD_RESET_TOKEN',
    status: 400,
    messages: ['ORGANIZATION[Invalid Password Reset Token]']
  },

  ORGANIZATION_BAD_REQUEST_PASSWORDS_NOT_EQUAL: {
    error: 'ORGANIZATION.BAD_REQUEST_PASSWORDS_NOT_EQUAL',
    status: 400,
    messages: ['ORGANIZATION[Passwords Not Equal]']
  },

  // V1Read
  ORGANIZATION_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST: {
    error: 'ORGANIZATION.BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST',
    status: 404,
    messages: ['ORGANIZATION[ORGANIZATION Account Does Not Exist]']
  },

  ORGANIZATION_BAD_REQUEST_DOES_NOT_INTEGRATED_WITH_FINCH: {
    error: 'ORGANIZATION.BAD_REQUEST_DOES_NOT_INTEGRATED_WITH_FINCH',
    status: 404,
    messages: ['ORGANIZATION has not integrated with HRIS system']
  }
};

module.exports = LOCAL_ERROR_CODES;
