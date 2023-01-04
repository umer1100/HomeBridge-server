/**
 * EmployeeSync V1LastSync ACTION
 */

 'use strict';

 // third-party
 const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

 // services
 const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

 // models
 const models = require('../../../models');

 // methods
 module.exports = {
  V1LastSync
 }

 /**
  * Read and return Last sync
  *
  * GET /v1/hris-sync/last
  * POST /v1/hris-sync/last
  *
  * Must be logged in
  * Roles: ['user']
  *
  * req.params = {}
  * req.args = {
  *   @organizationId - (NUMBER - OPTIONAL) [DEFAULT - req.user.organizationId]
  * }
  *
  * Success: Return a last sync record.
  * Errors:
  *   400: BAD_REQUEST_INVALID_ARGUMENTS
  *   400: EMPLOYEE_SYNC_BAD_REQUEST_NO_SYNC_RUN
  *   401: UNAUTHORIZED
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1LastSync(req) {
   const schema = joi.object({
    organizationId: joi.number().min(1).default(req.user.organizationId).optional()
   });

   // validate
   const { error, value } = schema.validate(req.args);
   if (error)
     return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
   req.args = value; // updated arguments with type conversion

   // find last sync record
   const findLastSync = await models.employeeSync.findOne({
    where: { organizationId: req.args.organizationId },
    order: [ [ 'createdAt', 'DESC' ]],
   }).catch(err => Promise.reject(err));

   // check if admin exists
   if (!findLastSync)
     return Promise.resolve(errorResponse(req, ERROR_CODES.EMPLOYEE_SYNC_BAD_REQUEST_NO_SYNC_RUN));

   return Promise.resolve({
     status: 200,
     success: true,
     lastSync: findLastSync.dataValues
   });
 } // END V1Read
