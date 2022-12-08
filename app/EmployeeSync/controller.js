/**
 * EMPLOYEESYNC CONTROLLER
 *
 * Defines which EmployeeSync action methods are called based on the type of user role
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// helpers
const { errorResponse, ERROR_CODES } = require('../../services/error');

// actions
const actions = require('./actions');
const { isEmployer } = require('../User/helper');

// queues
const Queue = require('bull'); // process background tasks from Queue
const EmployeeSyncQueue = new Queue('EmployeeSyncQueue', REDIS_URL);

module.exports = {
  V1Import
};

/**
 * Import employees into user database from their HRIS
 *
 * /v1/hris-import/users
 *
 * Must be logged in
 * Roles: ['user']
 */
async function V1Import(req, res, next) {
  // which method to call
  if (isEmployer(req.user)) await EmployeeSyncQueue.add('V1Import', { organizationId: req.user.organizationId });
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  return res.status(200).json('Started Import');
}
