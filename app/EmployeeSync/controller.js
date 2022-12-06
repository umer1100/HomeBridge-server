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
 * Example Method
 *
 * /v1/employeesyncs/example
 *
 * Must be logged out | Must be logged in | Can be both logged in or logged out
 * Roles: ['admin', 'member']
 */
async function V1Example(req, res, next) {
  let method = null; // which action method to use

  // Call the correct action method based on type of user of role
  if (req.admin) method = `V1ExampleByAdmin`;
  else if (req.member) method = `V1ExampleByMember`;
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  try {
    const result = await actions[method](req);

    return res.status(result.status).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Import employees into user database from their HRIS
 *
 * /v1/employeesyncs/import
 *
 * Must be logged in
 * Roles: ['user']
 */
async function V1Import(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (isEmployer(req.user)) await EmployeeSyncQueue.add('V1Import', { organizationId: req.user.organizationId });
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  return res.status(200).json('Started Import');
}
