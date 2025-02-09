/**
 * QUESTIONAIRE ERROR
 *
 * For Better Client 4xx Error Handling For Questionaire Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Questionaire Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend QUESTIONAIRE to the key and error value  */
  // QUESTIONAIRE_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'QUESTIONAIRE.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['QUESTIONAIRE[Account is not active]']
  // }

  QUESTIONNAIRE_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST: {
    error: 'QUESTIONNAIRE.BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST',
    status: 404,
    messages: ['QUESTIONNAIRE[QUESTIONNAIRE Does Not Exist]']
  }
};

module.exports = LOCAL_ERROR_CODES;
