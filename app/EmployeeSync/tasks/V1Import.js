/**
 * EMPLOYEESYNC V1Import TASK
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third-party
const _ = require('lodash'); // general helper methods: https://lodash.com/docs
const Op = require('sequelize').Op; // for model operator aliases like $gte, $eq
const io = require('socket.io-emitter')(REDIS_URL); // to emit real-time events to client-side applications: https://socket.io/docs/emit-cheatsheet/
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
const Queue = require('bull'); // add background tasks to Queue: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueclean
const slugify = require('slugify'); // convert string to URL friendly string: https://www.npmjs.com/package/slugify
const passport = require('passport'); // handle authentication: http://www.passportjs.org/docs/
const axios = require('axios');

// services
const email = require('../../../services/email');
const { SOCKET_ROOMS, SOCKET_EVENTS } = require('../../../services/socket');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

// helpers

// queues
const EmployeeSyncQueue = new Queue('EmployeeSyncQueue', REDIS_URL);

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

  try {
    let finchDirectoryUrl = 'https://api.tryfinch.com/employer/directory';
    let finchIndividualUrl = 'https://api.tryfinch.com/employer/individual';
    let organization = await models.organization.findByPk(organizationId, {
      attributes: ['hrisAccessToken']
    });

    let resp = await axios.get(finchDirectoryUrl, {
      headers: {
        Authorization: `Bearer ${organization.hrisAccessToken}`,
        'Finch-API-Version': '2020-09-17'
      }
    });
    if (resp.data) {
      let body = { requests: [] };
      resp.data.individuals.forEach(individual => {
        body.requests.push({ individual_id: individual.id });
      });

      let individuals = await axios.post(finchIndividualUrl, body, {
        headers: {
          Authorization: `Bearer ${organization.hrisAccessToken}`,
          'Finch-API-Version': '2020-09-17'
        }
      });

      individuals.data.responses.forEach(individual => {
        (async () => {
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
            dateOfBirth: individual.body.dob
          });
        })();
      });
    }

    // return
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1ExampleTask
