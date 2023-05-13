/**
 * USER BACKGROUND WORKER
 *
 * This is where we process background tasks for the User feature.
 * Gets exported to the top level /worker.js to be run in a worker process.
 */

'use strict';

// ENV variables

// third party node modules

// services
const { queueError } = require('../../services/error');
const { createQueue } = require('../../services/queue')

// tasks
const tasks = require('./tasks');

// Queues
const UserQueue = createQueue('UserQueue')
const BulkInvitationQueue = createQueue('BulkInvitationQueue')

// Function is called in /worker.js
// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {
  // Process User Feature Background Tasks
  UserQueue.on('failed', async (job, error) => queueError(error, UserQueue, job));
  UserQueue.on('stalled', async job => queueError(new Error('Queue Stalled.'), UserQueue, job));
  UserQueue.on('error', async error => queueError(error, UserQueue));

  BulkInvitationQueue.process('V1BulkInvitation', tasks.V1BulkInvitation);
  BulkInvitationQueue.on('failed', async (job, error) => queueError(error, BulkInvitationQueue, job));
  BulkInvitationQueue.on('stalled', async job => queueError(new Error('Queue Stalled.'), BulkInvitationQueue, job));
  BulkInvitationQueue.on('error', async error => queueError(error, BulkInvitationQueue));
  // future tasks below

  // return array of queues to the top level worker.js to gracefully close them
  return [UserQueue, BulkInvitationQueue]; // return empty array [] if not using any queues in this feature
};
