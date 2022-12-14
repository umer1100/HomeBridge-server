/**
 * EMPLOYEESYNC V1Import TASK
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean
const axios = require('axios'); // http requests
const moment = require('moment-timezone'); // manage timezone and dates: https://momentjs.com/timezone/docs/

// services
const email = require('../../../services/email');
const { SOCKET_ROOMS, SOCKET_EVENTS } = require('../../../services/socket');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');
const { date } = require('@hapi/joi');

// helpers

// queues

// methods
module.exports = {
  V1Import
};

/**
 * Method Description
 *
 * @job = {
 *   @id - (INTEGER - REQUIRED): ID of the background job
 *   @data = {
 *     @organizationId - (INTEGER - REQUIRED): the organization which is syncing the employee data
 *   }
 * }
 *
 * Success: Resolve without error
 *
 * TODO: Check to see if employees are already within our database
 */
async function V1Import(job) {
  const schema = joi.object({
    organizationId: joi.number().min(1).required().error(new Error('Organization id not valid.'))
  });

  // validate
  const { error, value } = schema.validate(job.data);
  if (error) return Promise.resolve(new Error(joiErrorsMessage(error)));
  job.data = value; // updated arguments with type conversion

  let { organizationId } = job.data;

  let currentRun = await models.employeeSync.create({
    organizationId: organizationId,
    startedAt: moment.tz('UTC'),
    status: 'RUNNING'
  });

  try {
    const finchDirectoryUrl = 'https://api.tryfinch.com/employer/directory';
    const finchIndividualUrl = 'https://api.tryfinch.com/employer/individual';

    let organization = await models.organization.findByPk(organizationId);
    let preexistingUsers = await models.user.findAll({
      where: {
        organizationId: organizationId
      },
      attributes: ['finchID']
    });
    let preexistingFinchIDs = [];
    preexistingUsers.forEach(user => (user.finchID ? preexistingFinchIDs.push(user.finchID) : null));

    let resp = await axios.get(finchDirectoryUrl, {
      headers: {
        Authorization: `Bearer ${organization.hrisAccessToken}`,
        'Finch-API-Version': '2020-09-17'
      }
    });
    if (resp.data) {
      let body = { requests: [] };

      let employeeTotal = resp.data.individuals.length;

      resp.data.individuals.forEach(individual => {
        body.requests.push({ individual_id: individual.id });
      });

      let individuals = await axios.post(finchIndividualUrl, body, {
        headers: {
          Authorization: `Bearer ${organization.hrisAccessToken}`,
          'Finch-API-Version': '2020-09-17'
        }
      });

      //
      individuals.data.responses.forEach(individual => {
        (async () => {
          if (preexistingFinchIDs.indexOf(individual.body.id) >= 0) {
            preexistingFinchIDs.splice(preexistingFinchIDs.indexOf(individual.body.id), 1);
          } else {
            console.log('Adding email ' + individual.body.emails[0].data);
            await models.user.create({
              firstName: individual.body.first_name,
              lastName: individual.body.last_name,
              status: 'PENDING',
              email: individual.body.emails[0].data,
              roleType: 'EMPLOYEE',
              password: 'PLACEHOLDER',
              organizationId: organizationId,
              addressLine1: individual.body.residence.line1,
              addressLine2: individual.body.residence.line2,
              city: individual.body.residence.city,
              state: individual.body.residence.state,
              country: individual.body.residence.country,
              zipcode: individual.body.residence.postal_code,
              dateOfBirth: individual.body.dob,
              finchID: individual.body.id
            });
          }
        })();
      });

      let removedUsers = preexistingFinchIDs ? preexistingFinchIDs : [];

      // Set all users that are no longer in Finch to inactive and remove their organization ID
      removedUsers.forEach(finchID => {
        (async () => {
          await models.user.update(
            {
              status: 'INACTIVE',
              organizationId: null
            },
            {
              where: { finchID: finchID }
            }
          );
        })();
      });
    }

    models.employeeSync.update(
      {
        finishedAt: moment.tz('UTC'),
        status: 'FINISHED',
        succeeded: true,
        description: {}
      },
      {
        where: { id: currentRun.id }
      }
    );

    // return
    return Promise.resolve();
  } catch (error) {
    models.employeeSync.update(
      {
        finishedAt: moment.tz('UTC'),
        status: 'FINISHED',
        succeeded: false,
        description: { message: error }
      },
      {
        where: { id: currentRun.id }
      }
    );

    return Promise.reject(error);
  }
} // END V1ExampleTask
