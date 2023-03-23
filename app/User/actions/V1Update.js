/**
 * USER V1Update ACTION
 */

 'use strict';

 // third-party
 const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

 // services
 const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

 // models
 const { user } = require('../../../models');

 // methods
 module.exports = {
   V1Update
 };

 /**
  * Update and return an user
  *
  * GET  /v1/users/Update
  * POST /v1/users/Update
  *
  * Must be logged in
  * Roles: ['User']
  *
  * req.params = {}
  * req.args = {
  *   @status - (STRING - OPTIONAL): The user status
  * }
  *
  * Success: Return a updated users.
  * Errors:
  *   400: BAD_REQUEST_INVALID_ARGUMENTS
  *   401: UNAUTHORIZED
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1Update(req) {
   const schema = joi.object({
    firstName: joi.string().trim().min(1).optional(),
    lastName: joi.string().trim().min(1).optional(),
    addressLine1: joi.string().trim().min(1).optional(),
    addressLine2: joi.string().allow('').optional(),
    city: joi.string().trim().min(1).optional(),
    zipcode: joi.string().trim().min(1).optional(),
    status: joi.string().optional(),
    primaryGoal: joi.string().trim().min(1).optional(),
    goalTimeline: joi.string().trim().min(1).optional(),
    state: joi.string().trim().min(1).optional(),
    phone: joi.string().trim().min(1).optional(),
    dreamHomeDescription: joi.string().trim().min(1).optional(),
    dateOfBirth: joi.string().trim().min(1).optional(),
    acceptedTerms: joi.bool().optional(),
   });

   // validate
   const { error, value } = schema.validate(req.args);
   if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
   req.args = value; // updated arguments with type conversion

   // find user
   const findUser = await user.findByPk(req.user.id, {
      attributes: {
        exclude: user.getSensitiveData() // remove sensitive data
      }
    }).catch(err => Promise.reject(error));

   // check if user exists
   if (!findUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_ACCOUNT_DOES_NOT_EXIST));

   try {
    // update user
    await findUser.update(req.args);

    return Promise.resolve({
      status: 200,
      success: true,
      data: findUser.dataValues
    });
  } catch (error) {
    return Promise.reject(error);
  }
 } // END V1Update
