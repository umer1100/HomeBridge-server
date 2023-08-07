/**
 * SESSION BACKGROUND WORKER
 *
 * This is where we process background tasks for the Session feature.
 * Gets exported to the top level /worker.js to be run in a worker process.
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// third party node modules
const Queue = require('bull'); // process background tasks from Queue
const SessionQueue = new Queue('SessionQueue', REDIS_URL, { redis: { tls: {rejectUnauthorized: false} }});


// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {

  // return array of queues to the top level worker.js to gracefully close them
  return [SessionQueue];  // return empty array [] if not using any queues in this feature
}
