/**
 * PROGRAM V1DistributeDefaultContributions TASK
 */

'use strict';

// ENV variables
const { REDIS_URL } = process.env;

// third-party
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean

// services
let dwolla = require('../../../services/dwolla');

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
 * Task run monthly to grab all programs and distribute cash from Employer to all Employees
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
    let programs = await models.program.findAll();

    programs.forEach(async program => {
      let organization = program.organization;

      let users = models.user.findAll({
        where: {
          roleType: 'EMPLOYEE',
          organizationId: organization.id,
          where: {
            status: 'active'
          }
        }
      });

      let employer = models.users.findOne({ where: { roleType: 'EMPLOYER', organizationId: organization.id } });

      users.forEach(async user => {
        await dwolla.transferFunds(employer.fundingSourceUrl, user.fundingSourceUrl, program.defaultContribution);
      });
    });

    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1DistributeDefaultContributions
