/**
 * QUESTIONAIRE BACKGROUND WORKER
 *
 * This is where we process background tasks for the Questionaire feature.
 * Gets exported to the top level /worker.js to be run in a worker process.
 */

'use strict';

// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {

  // return array of queues to the top level worker.js to gracefully close them
  return [];  // return empty array [] if not using any queues in this feature
}
