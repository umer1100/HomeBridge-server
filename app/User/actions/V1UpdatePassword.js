/**
 * User V1UpdatePassword ACTION
 */

 'use strict';

 // third-party
 const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md
 const bcrypt = require('bcrypt');

 // services
 const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

 // models
 const { user } = require('../../../models');

 // helpers
 const { PASSWORD_LENGTH_MIN, PASSWORD_REGEX } = require('../../../helpers/constants');

 // methods
 module.exports = {
   V1UpdatePassword
 }

 /**
  * Update password of user
  *
  * GET  /v1/users/update-password
  * POST /v1/users/update-password
  *
  * Must be logged in
  * Roles: ['user']
  *
  * req.params = {}
  * req.args = {
  *   @password - (STRING - REQUIRED): the current password
  *   @password1 - (STRING - REQUIRED): password 1
  *   @password2 - (STRING - REQUIRED): password 2
  * }
  *
  * Success: Return a true.
  * Errors:
  *   400: BAD_REQUEST_INVALID_ARGUMENTS
  *   400: USER_BAD_REQUEST_PASSWORDS_NOT_EQUAL
  *   400: USER_BAD_REQUEST_PASSWORD_AUTHENTICATION_FAILED
  *   401: UNAUTHORIZED
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1UpdatePassword(req) {
   const schema = joi.object({
     password: joi.string().min(8).required(),
     password1: joi.string().min(PASSWORD_LENGTH_MIN).regex(PASSWORD_REGEX).required().error(new Error(req.__('Invalid Password Format'))),
     password2: joi.string().min(PASSWORD_LENGTH_MIN).regex(PASSWORD_REGEX).required().error(new Error(req.__('Invalid Password Format')))
   });

   // validate
   const { error, value } = schema.validate(req.args);
   if (error)
     return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

   // check password1 and password2 equality
   if (req.args.password1 !== req.args.password2)
     return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_PASSWORDS_NOT_EQUAL));

   try {
     // validate password
     const result = await user.validatePassword(req.args.password, req.user.password);

     // if password is incorrect
     if (!result)
       return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_PASSWORD_AUTHENTICATION_FAILED));

     // hash new password
     const newPassword = bcrypt.hashSync(req.args.password1, req.user.salt);

     // update password
     await user.update({
       password: newPassword
     }, {
       fields: ['password'], // only these fields
       where: {
         id: req.user.id
       }
     });

     // return success
     return Promise.resolve({
       status: 200,
       message: 'Password successfully updated.',
       success: true
     });
   } catch (error) {
     return Promise.reject(error);
   }
 } // END V1UpdatePassword
