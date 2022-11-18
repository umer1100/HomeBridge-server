/**
 * USER V1ConfirmEmail ACTION
 */

 'use strict';

 // services
 const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

 // third-party
 const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

 // models
 const { user } = require('../../../models');

 // methods
 module.exports = {
  V1ConfirmEmail
 };

 /**
  * Confirm Email
  *
  * GET  /v1/users/confirm-email
  *
  * Must be logged out
  * Roles: []
  *
  * req.params = {}
  * req.args = {}
  * req.query = {
  *   @emailConfirmationToken - (STRING - REQUIRED): The email confirmation token of the user
  * }
  *
  * Success: Return true
  * Errors:
  *   400: BAD_REQUEST_INVALID_ARGUMENTS
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1ConfirmEmail(req) {
   const schema = joi.object({
    emailConfirmationToken: joi.string().trim().min(5).required()
   });

   // validate
   const { error, value } = schema.validate(req.args);
   if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));

   const { emailConfirmationToken } = req.args

   // grab user with this email
   try {
     const findUser = await user.findOne({
       where: {
         emailConfirmedToken: emailConfirmationToken
       }
     });

     // if user cannot be found
     if (!findUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_INVALID_EMAIL_CONFIRMATION_TOKEN));

    // update emailConfirmation to true
    await user.update(
      {
        emailConfirmed: true,
        status: 'ACTIVE',
      },
      {
        fields: ['emailConfirmed', 'status'], // only these fields
        where: {
          id: findUser.id
        }
      }
    );

     // return success
     return Promise.resolve({
       status: 200,
       success: true,
       message: 'Email successfully confirmed.',
     });
   } catch (error) {
     return Promise.reject(error);
   }
 } // END V1ConfirmEmail
