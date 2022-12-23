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

// services
const { getDirectory, getIndividuals, getEmployments } = require('../../../services/finch');
const { joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');
const { date } = require('@hapi/joi');

// helpers
const { startSync, updateSync } = require('../helper');

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

  let currentRunId = await startSync(organizationId);

  try {
    let organization = await models.organization.findByPk(organizationId);
    let preexistingUsers = await models.user.findAll({
      where: {
        organizationId: organizationId
      },
      attributes: ['finchID']
    });
    let preexistingFinchIDs = [];
    preexistingUsers.forEach(user => (user.finchID ? preexistingFinchIDs.push(user.finchID) : null));

    let resp = await getDirectory(organization.hrisAccessToken);
    if (resp) {
      let body = { requests: [] };

      resp.individuals.forEach(individual => {
        body.requests.push({ individual_id: individual.id });
      });

      let individuals = await getIndividuals(body, organization.hrisAccessToken);
      let employments = await getEmployments(body, organization.hrisAccessToken);

      let requiredEmploymentDetails = employments.responses.map(({body, individual_id}) => {
        return {
          finchID: individual_id,
          title: body.title,
          department: body.department.name,
          endDate: body.end_date,
          startDate: body.start_date,
        }
      })

      individuals.responses.forEach(individual => {
        (async () => {
          const employmentAttributes = requiredEmploymentDetails.find((emp) => {
            return emp.finchID === individual.body.id
          })

          const userAttributes = {
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
            ...employmentAttributes
          }

          if (preexistingFinchIDs.indexOf(individual.body.id) >= 0) {
            models.user.update({
              ...userAttributes
            }, {
              where: { finchID: individual.body.id }
            })
            preexistingFinchIDs.splice(preexistingFinchIDs.indexOf(individual.body.id), 1);
          } else {
            await models.user.create({
              ...userAttributes
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

    await updateSync(currentRunId, 'FINISHED', true, {});

    // return
    return Promise.resolve();
  } catch (error) {
    await updateSync(currentRunId, 'FINISHED', false, { message: error });

    return Promise.reject(error);
  }
} // END V1Import
