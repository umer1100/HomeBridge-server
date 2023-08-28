/**
 * AGENT ERROR
 *
 * For Better Client 4xx Error Handling For Agent Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Agent Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend AGENT to the key and error value  */
  // AGENT_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'AGENT.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['AGENT[Account is not active]']
  // }

  AGENT_BAD_REQUEST_AGENT_ALREADY_EXISTS: {
    error: 'AGENT.BAD_REQUEST_AGENT_ALREADY_EXISTS',
    status: 400,
    messages: ['AGENT[Agent Already Exists]']
  },
};

module.exports = LOCAL_ERROR_CODES;
