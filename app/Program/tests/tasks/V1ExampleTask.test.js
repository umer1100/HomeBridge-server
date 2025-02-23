/**
 * TEST PROGRAM V1ExampleTask METHOD
 */

'use strict';

// build-in node modules
const path = require('path');

// load test env
require('dotenv').config({ path: path.join(__dirname, '../../../../config/.env.test') });

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third party
const i18n = require('i18n'); // https://github.com/mashpie/i18n-node
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/
const currency = require('currency.js'); // handling currency operations (add, subtract, multiply) without JS precision issues: https://github.com/scurker/currency.js/

// server & models
const app = require('../../../../server');
const models = require('../../../../models');

// assertion library
const { expect } = require('chai');
const request = require('supertest');

// tasks
const { V1ExampleTask } = require('../../../../app/Program/tasks');

// services
const { errorResponse, ERROR_CODES } = require('../../../../services/error');

// helpers
const { adminLogin, userLogin, reset, populate } = require('../../../../helpers/tests');

// queues
const ProgramQueue = new Queue('ProgramQueue', REDIS_URL);

describe.skip('Program.V1ExampleTask', async () => {
  // grab fixtures here
  const adminFix = require('../../../../test/fixtures/fix1/admin');
  const userFix = require('../../../../test/fixtures/fix1/user');

  // clear database, populate database with fixtures and empty queues
  beforeEach(async () => {
    try {
      await reset();
      await populate('fix1');
      await ProgramQueue.empty();
    } catch (error) {
      console.error(error);
      throw err;
    }
  });

  it('should test something', async () => {
    try {
      // execute tests here
    } catch (error) {
      console.error(error);
      throw error;
    }
  }); // END should test something
}); // END Program.V1ExampleTask
