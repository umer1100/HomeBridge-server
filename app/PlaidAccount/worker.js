/**
 * PLAIDACCOUNT BACKGROUND WORKER
 *
 * This is where we process background tasks for the Account feature.
 * Gets exported to the top level /worker.js to be run in a worker process.
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// third party node modules
const Queue = require('bull'); // process background tasks from Queue
const PlaidAccountQueue = new Queue('PlaidAccountQueue', REDIS_URL);

// services
const { queueError } = require('../../services/error');

// Function is called in /worker.js
// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {
  // Process PlaidAccount Feature Background Tasks
  PlaidAccountQueue.on('failed', async (job, error) => queueError(error, PlaidAccountQueue, job));
  PlaidAccountQueue.on('stalled', async job => queueError(new Error('Queue Stalled.'), PlaidAccountQueue, job));
  PlaidAccountQueue.on('error', async error => queueError(error, PlaidAccountQueue));

  // future tasks below

  // return array of queues to the top level worker.js to gracefully close them
  return [PlaidAccountQueue]; // return empty array [] if not using any queues in this feature
};
