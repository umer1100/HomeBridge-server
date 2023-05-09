/**
 * TRANSACTION BACKGROUND WORKER
 *
 * This is where we process background tasks for the Transaction feature.
 * Gets exported to the top level /worker.js to be run in a worker process.
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// third party node modules
const Queue = require('bull'); // process background tasks from Queue
const TransactionQueue = new Queue('TransactionQueue', REDIS_URL, { redis: { tls: {rejectUnauthorized: false} } });

// services
const { queueError } = require('../../services/error');

// tasks
const tasks = require('./tasks');

// Function is called in /worker.js
// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {
  // Process Transaction Feature Background Tasks
  TransactionQueue.on('failed', async (job, error) => queueError(error, TransactionQueue, job));
  TransactionQueue.on('stalled', async job => queueError(new Error('Queue Stalled.'), TransactionQueue, job));
  TransactionQueue.on('error', async error => queueError(error, TransactionQueue));

  // future tasks below

  // return array of queues to the top level worker.js to gracefully close them
  return [TransactionQueue]; // return empty array [] if not using any queues in this feature
};
