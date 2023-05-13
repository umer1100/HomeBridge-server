/**
 * Queue Service for creating Queues
 */

'use strict';

module.exports = {
  createQueue
};

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;


function createQueue(name){
  // third party node modules
  const Queue = require('bull'); // process background tasks from Queue
  let queueParams = {}
  if (NODE_ENV !== 'development')
    queueParams = { redis: { tls: {rejectUnauthorized: false} } }

  return new Queue(name, REDIS_URL, queueParams);
}