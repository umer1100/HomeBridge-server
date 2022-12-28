/**
 * EMPLOYEESYNC HELPER
 */

'use strict';

// third party
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

// models
const models = require('../../models');

module.exports = {
  createSync,
  updateSync
};

async function createSync(organizationId) {
  let currentRun = await models.employeeSync.create({
    organizationId: organizationId,
    status: 'PENDING'
  });

  return currentRun.id;
}

async function updateSync(syncId, updatedArguments) {
  let currentRun = await models.employeeSync.update(
    updatedArguments,
    {
      where: { id: syncId }
    }
  );

  return currentRun.id;
}
