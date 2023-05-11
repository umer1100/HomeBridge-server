/**
 * CREDITWALLETLOG BACKGROUND WORKER
 *
 * This is where we process background tasks for the CreditWalletLog feature.
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

const CreditWalletLogQueue = createQueue('CreditWalletLogQueue')

// Function is called in /worker.js
// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {

  // Process CreditWalletLog Feature Background Tasks
  CreditWalletLogQueue.on('failed', async (job, error) => queueError(error, CreditWalletLogQueue, job));
  CreditWalletLogQueue.on('stalled', async job => queueError(new Error('Queue Stalled.'), CreditWalletLogQueue, job));
  CreditWalletLogQueue.on('error', async error => queueError(error, CreditWalletLogQueue));

  // future tasks below

  // return array of queues to the top level worker.js to gracefully close them
  return [CreditWalletLogQueue];  // return empty array [] if not using any queues in this feature
}
