/**
 * Agent V1Create ACTION
 */

'use strict';

// ENV variables
const { REDIS_URL, WEB_HOSTNAME } = process.env;

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

// models
const models = require('../../../models');

 // helpers
 const { joiAddressSchema } = require('../../Address/helper');

 // methods
module.exports = {
  V1Create
};

/**
 * Create an agent
 *
 * GET  /v1/agents/create
 * POST /v1/agents/create
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *   @firstName - (STRING - REQUIRED): The first name of the new agent
 *   @lastName - (STRING - REQUIRED): The last name of the new agent
 *   @email - (STRING - REQUIRED): The email of the agent
 *   @phone - (STRING - REQUIRED): The phone of the agent
 *   @addressline1 - (STRING - OPTIONAL): The first line of the address of the agent
 *   @addressline2 - (STRING - OPTIONAL): The second line of the address of the agent
 *   @city - (STRING - OPTIONAL): The city of the address of the agent
 * }
 *
 * Success: Return an agent
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: AGENT_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED
 *   400: AGENT_BAD_REQUEST_AGENT_ALREADY_EXISTS
 *   400: AGENT_BAD_REQUEST_INVALID_TIMEZONE
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1Create(req) {
  const schema = joi.object({
    firstName: joi.string().trim().min(1).required(),
    lastName: joi.string().trim().min(1).required(),
    email: joi.string().trim().lowercase().min(3).email().required(),
    phone: joi.string().trim(),
    officeName: joi.string().trim().min(1),
    imageURL: joi.string().trim().min(1),
    applicationURL: joi.string().trim().min(1),
    reviewsURL: joi.string().trim().min(1),
    addresses: joi.array().items(joiAddressSchema())
  });
  // validate
  const { error, value } = schema.validate(req.args);

  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    // check if agent email already exists
    const duplicateAgent = await models.agent.findOne({
      where: {
        email: req.args.email
      }
    });

    // check of duplicate agent agent
    if (duplicateAgent) return Promise.resolve(errorResponse(req, ERROR_CODES.AGENT_BAD_REQUEST_AGENT_ALREADY_EXISTS));

    // create agent
    const newAgent = await models.agent.create({
      firstName: req.args.firstName,
      lastName: req.args.lastName,
      email: req.args.email,
      phone: req.args.phone,
      imageURL: req.args.imageURL,
      applicationURL: req.args.applicationURL,
      reviewsURL: req.args.reviewsURL,
      officeName: req.args.officeName
    });

    if (req.args.addresses?.length > 0) {
      await Promise.all(
        req.args.addresses.map(async request => {
          await newAgent.createAddress(request);
        })
      )
     }

    // grab agent without sensitive data
    const returnAgent = await models.agent
      .findByPk(newAgent.id, {
        include: {
          model: models.address
        }
      })
      .catch(err => {
        newAgent.destroy(); // destroy if error
        return Promise.reject(err);
      }); // END grab partner without sensitive data

    // return
    return Promise.resolve({
      status: 201,
      success: true,
      agent: returnAgent
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Create
