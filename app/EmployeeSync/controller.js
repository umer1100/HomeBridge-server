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
const { createSync } = require('../EmployeeSync/helper')

// actions
const actions = require('./actions');
const { isEmployer } = require('../User/helper');

// queues
const Queue = require('bull'); // process background tasks from Queue
// const EmployeeSyncQueue = new Queue('EmployeeSyncQueue', REDIS_URL);

module.exports = {
  V1Import,
  V1LastSync
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
  if (isEmployer(req.user)) {
    const { organizationId } = req.user
    const currentRunId = await createSync(organizationId)
    // await EmployeeSyncQueue.add('V1Import', { organizationId, currentRunId });
  }
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  return res.status(200).json({ success: true, message: 'Started Import' });
}

/**
 * Return last sync for an organization
 *
 * /v1/hris-sync/last
 *
 * Must be logged in
 * Roles: ['user']
 */
async function V1LastSync(req, res, next) {
  let method = null; // which action method to use

  // which method to call
  if (req.user) method = 'V1LastSync';
  else return res.status(401).json(errorResponse(req, ERROR_CODES.UNAUTHORIZED));

  // call correct method
  const result = await actions[method](req).catch(err => next(err));
  return res.status(result.status).json(result);
}
