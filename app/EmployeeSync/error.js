/**
 * EMPLOYEESYNC ERROR
 *
 * For Better Client 4xx Error Handling For EmployeeSync Feature
 * Gets exported to /services/error.js and put in the global variable ERROR_CODES
 */

'use strict';

/**
 * EmployeeSync Feature Local Error Codes
 */
const LOCAL_ERROR_CODES = {
  // V1UpdatePassword
  EMPLOYEE_SYNC_BAD_REQUEST_NO_SYNC_RUN: {
    error: 'EMPLOYEE_SYNC.BAD_REQUEST_NO_SYNC_RUN',
    status: 400,
    messages: ['Sync Never Started']
  }
};

module.exports = LOCAL_ERROR_CODES;
