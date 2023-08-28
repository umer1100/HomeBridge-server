/**
 * AGENT V1Read ACTION
 */

 'use strict';

 // third-party
 const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

 // services
 const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

 // models
 const { agent, address } = require('../../../models');

 // methods
 module.exports = {
   V1Read
 };

 /**
  * Read and return an agent
  *
  * GET  /v1/agents/read
  * POST /v1/agents/read
  *
  * Must be logged in
  * Roles: ['agent']
  *
  * req.params = {}
  * req.args = {
  *   @id - (NUMBER - OPTIONAL): The id of an agent
  * }
  *
  * Success: Return a agent.
  * Errors:
  *   400: BAD_REQUEST_INVALID_ARGUMENTS
  *   400: AGENT_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST
  *   401: UNAUTHORIZED
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1Read(req) {
   const schema = joi.object({
     id: joi.number().min(1).optional()
   });

   // validate
   const { error, value } = schema.validate(req.args);
   if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
   req.args = value; // updated arguments with type conversion

   // find agent
   const findAgent = await agent
     .findByPk(req.args.id, {
       include: {
         model: address,
       }
     })
     .catch(error => Promise.reject(error));

   // check if agent exists
   if (!findAgent) return Promise.resolve(errorResponse(req, ERROR_CODES.AGENT_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

   return Promise.resolve({
     status: 200,
     success: true,
     data: findAgent.dataValues
   });
 } // END V1Read
