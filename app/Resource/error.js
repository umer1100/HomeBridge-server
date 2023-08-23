/**
 * RESOURCE ERROR
 *
 * For Better Client 4xx Error Handling For Resource Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * Resource Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  /* Place error codes below. Remember to prepend RESOURCE to the key and error value  */
  // RESOURCE_BAD_REQUEST_ACCOUNT_INACTIVE: {
  //   error: 'RESOURCE.BAD_REQUEST_ACCOUNT_INACTIVE',
  //   status: 401,
  //   messages: ['RESOURCE[Account is not active]']
  // }
};

module.exports = LOCAL_ERROR_CODES;
