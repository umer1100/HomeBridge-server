/**
 * USER ERROR
 *
 * For Better Client 4xx Error Handling For User Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * User Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend USER to the key and error value  */
  // USER_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'USER.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['USER[Account is not active]']
  // }

  // V1Login
  USER_BAD_REQUEST_INVALID_LOGIN_CREDENTIALS: {
    error: 'USER.BAD_REQUEST_INVALID_LOGIN_CREDENTIALS',
    status: 400,
    messages: ['USER[Invalid Login Credentials]']
  },

  USER_BAD_REQUEST_ACCOUNT_INACTIVE: {
    error: 'USER.BAD_REQUEST_ACCOUNT_INACTIVE',
    status: 400,
    messages: ['USER[User Account Inactive]']
  },

  USER_BAD_REQUEST_EMAIL_CONFIRMATION_PENDING: {
    error: 'USER.BAD_REQUEST_EMAIL_CONFIRMATION_PENDING',
    status: 400,
    messages: ['USER[User Email confirmation is pending]']
  },

  USER_BAD_REQUEST_ACCOUNT_DELETED: {
    error: 'USER.BAD_REQUEST_ACCOUNT_DELETED',
    status: 400,
    messages: ['USER[User Account Deleted]']
  },

  // V1Create
  USER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED: {
    error: 'USER.BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED',
    status: 400,
    messages: ['USER[Terms of Service Not Accepted]']
  },

  USER_BAD_REQUEST_USER_ALREADY_EXISTS: {
    error: 'USER.BAD_REQUEST_USER_ALREADY_EXISTS',
    status: 400,
    messages: ['USER[User Already Exists]']
  },

  USER_BAD_REQUEST_INVALID_EMAIL_CONFIRMATION_TOKEN: {
    error: 'USER.BAD_REQUEST_INVALID_EMAIL_CONFIRMATION_TOKEN',
    status: 400,
    messages: ['USER[Invalid Email Confirmation Token]']
  },

  USER_BAD_REQUEST_INVALID_TIMEZONE: {
    error: 'USER.BAD_REQUEST_INVALID_TIMEZONE',
    status: 400,
    messages: ['USER[Invalid Time Zone]']
  },

  // V1ConfirmPassword
  USER_BAD_REQUEST_INVALID_PASSWORD_RESET_TOKEN: {
    error: 'USER.BAD_REQUEST_INVALID_PASSWORD_RESET_TOKEN',
    status: 400,
    messages: ['USER[Invalid Password Reset Token]']
  },

  USER_BAD_REQUEST_PASSWORDS_NOT_EQUAL: {
    error: 'USER.BAD_REQUEST_PASSWORDS_NOT_EQUAL',
    status: 400,
    messages: ['USER[Passwords Not Equal]']
  },

  // V1Read
  USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST: {
    error: 'USER.BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST',
    status: 404,
    messages: ['USER[USER Account Does Not Exist]']
  },

  // V1UpdatePassword
  USER_BAD_REQUEST_PASSWORD_AUTHENTICATION_FAILED: {
    error: 'USER.BAD_REQUEST_PASSWORD_AUTHENTICATION_FAILED',
    status: 400,
    messages: ['USER[Password Authentication Failed]']
  },

  USER_BAD_REQUEST_HAVE_NO_ORGANIZATION: {
    error: 'USER.BAD_REQUEST_HAVE_NO_ORGANIZATION',
    status: 400,
    messages: ["USER[Doesn't belong to any organization]"]
  }
};

module.exports = LOCAL_ERROR_CODES;
