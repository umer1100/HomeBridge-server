/**
 * PROGRAM BACKGROUND WORKER
 *
 * This is where we process background tasks for the Program feature.
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

const ProgramQueue = createQueue('ProgramQueue')


// Function is called in /worker.js
// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {
  // Process Program Feature Background Tasks
  ProgramQueue.process('V1DistributeDefaultContributions', tasks.V1DistributeDefaultContributions);
  ProgramQueue.on('failed', async (job, error) => queueError(error, ProgramQueue, job));
  ProgramQueue.on('stalled', async job => queueError(new Error('Queue Stalled.'), ProgramQueue, job));
  ProgramQueue.on('error', async error => queueError(error, ProgramQueue));

  // future tasks below

  // return array of queues to the top level worker.js to gracefully close them
  return [ProgramQueue]; // return empty array [] if not using any queues in this feature
};
