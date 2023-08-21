/**
 * QUESTIONAIRE BACKGROUND WORKER
 *
 * This is where we process background tasks for the Questionaire feature.
 * Gets exported to the top level /worker.js to be run in a worker process.
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// third party node modules
const Queue = require('bull'); // process background tasks from Queue
const QuestionaireQueue = new Queue('QuestionaireQueue', REDIS_URL);

// Returns an array of Queues used in this feature so we can gracefully close them in worker.js
module.exports = () => {

  // return array of queues to the top level worker.js to gracefully close them
  return [QuestionaireQueue];  // return empty array [] if not using any queues in this feature
}
