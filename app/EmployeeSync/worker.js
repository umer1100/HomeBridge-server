/**
 * EMPLOYEESYNC BACKGROUND WORKER
 *
 * This is where we process background tasks for the EmployeeSync feature.
 * Gets exported to the top level /worker.js to be run in a worker process.
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// third party node modules
const Queue = require('bull'); // process background tasks from Queue

// services
const { queueError } = require('../../services/error');
const { createQueue } = require('../../services/queue')

// tasks
const tasks = require('./tasks');

const EmployeeSyncQueue = createQueue('EmployeeSyncQueue')

// Function is called in /worker.js
// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {
  // Process EmployeeSync Feature Background Tasks
  EmployeeSyncQueue.process('V1Import', tasks.V1Import);
  EmployeeSyncQueue.process('V1SyncAllOrganizations', tasks.V1SyncAllOrganizations);
  EmployeeSyncQueue.on('failed', async (job, error) => queueError(error, EmployeeSyncQueue, job));
  EmployeeSyncQueue.on('stalled', async job => queueError(new Error('Queue Stalled.'), EmployeeSyncQueue, job));
  EmployeeSyncQueue.on('error', async error => queueError(error, EmployeeSyncQueue));

  // future tasks below

  // return array of queues to the top level worker.js to gracefully close them
  return [EmployeeSyncQueue]; // return empty array [] if not using any queues in this feature
};
