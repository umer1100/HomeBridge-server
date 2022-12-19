/**
 * EMPLOYEESYNC HELPER
 */

'use strict';

// third party
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

// models
const models = require('../../models');

module.exports = {
  startSync,
  updateSync
};

async function startSync(organizationId) {
  let currentRun = await models.employeeSync.create({
    organizationId: organizationId,
    startedAt: moment.tz('UTC'),
    status: 'RUNNING'
  });

  return currentRun.id;
}

async function updateSync(syncId, status, succeeded, description) {
  await models.employeeSync.update(
    {
      finishedAt: moment.tz('UTC'),
      status: status,
      succeeded: succeeded,
      description: description
    },
    {
      where: { id: syncId }
    }
  );
}
