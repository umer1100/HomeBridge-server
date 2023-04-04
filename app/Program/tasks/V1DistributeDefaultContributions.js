/**
 * PROGRAM V1DistributeDefaultContributions TASK
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// third-party
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean

// services

// models
const models = require('../../../models');

// helpers

// queues
const ProgramQueue = new Queue('ProgramQueue', REDIS_URL);

// methods
module.exports = {
  V1DistributeDefaultContributions
};

/**
 * Task run monthly to grab all programs and distribute credit from Employer to all Employees
 *
 * @job = {
 *   @id - (INTEGER - REQUIRED): ID of the background job
 *   @data = {
 *     @programId - (STRING - REQUIRED): Alpha argument description
 *   }
 * }
 *
 * Success: resolve
 *
 */
async function V1DistributeDefaultContributions(job) {
  try {
    let programs = await models.program.findAll({
      where: {
       isProgramActive: true
      }
    });

    programs.forEach(async program => {
      let organizationId = program.organizationId;
      let users = await models.user.findAll({
        where: {
          roleType: 'EMPLOYEE',
          organizationId: organizationId,
          status: 'ACTIVE'
        }
      });
      users.forEach(async user => {
        await models.creditWallet.increment("dollars", {by: program.defaultContribution, where: {userId: user.id, walletType: 'EMPLOYER'}})
      });
    });

    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1DistributeDefaultContributions
