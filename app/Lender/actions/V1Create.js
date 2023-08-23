/**
 * Lender V1Create ACTION
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
  * Create an lender
  *
  * GET  /v1/lenders/create
  * POST /v1/lenders/create
  *
  * Must be logged out
  * Roles: []
  *
  * req.params = {}
  * req.args = {
  *   @firstName - (STRING - REQUIRED): The first name of the new lender
  *   @lastName - (STRING - REQUIRED): The last name of the new lender
  *   @email - (STRING - REQUIRED): The email of the lender
  *   @phone - (STRING - REQUIRED): The phone of the lender
  *   @addressline1 - (STRING - OPTIONAL): The first line of the address of the lender
  *   @addressline2 - (STRING - OPTIONAL): The second line of the address of the lender
  *   @city - (STRING - OPTIONAL): The city of the address of the lender
  * }
  *
  * Success: Return an lender
  * Errors:
  *   400: BAD_REQUEST_INVALID_ARGUMENTS
  *   400: LENDER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED
  *   400: LENDER_BAD_REQUEST_LENDER_ALREADY_EXISTS
  *   400: LENDER_BAD_REQUEST_INVALID_TIMEZONE
  *   401: UNAUTHORIZED
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1Create(req) {
   const schema = joi.object({
     firstName: joi.string().trim().min(1).required(),
     lastName: joi.string().trim().min(1).required(),
     email: joi.string().trim().lowercase().min(3).email().required(),
     phone: joi.string().trim(),
     nmlsId: joi.string().trim().min(1),
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
     // check if lender email already exists
     const duplicateLender = await models.lender.findOne({
       where: {
         email: req.args.email
       }
     });

     // check of duplicate lender lender
     if (duplicateLender) return Promise.resolve(errorResponse(req, ERROR_CODES.LENDER_BAD_REQUEST_LENDER_ALREADY_EXISTS));

     // create lender
     const newLender = await models.lender.create({
       firstName: req.args.firstName,
       lastName: req.args.lastName,
       email: req.args.email,
       phone: req.args.phone,
       imageURL: req.args.imageURL,
       nmlsId: req.args.nmlsId,
       applicationURL: req.args.applicationURL,
       reviewsURL: req.args.reviewsURL,
       officeName: req.args.officeName
     });

     if (req.args.addresses?.length > 0) {
      await Promise.all(
        req.args.addresses.map(async request => {
          await newLender.createAddress(request);
        })
      )
     }

     // grab lender without sensitive data
     const returnLender = await models.lender
       .findByPk(newLender.id, {
        include: {
          model: models.address
        }
      })
       .catch(err => {
         newLender.destroy(); // destroy if error
         return Promise.reject(err);
       }); // END grab partner without sensitive data

     // return
     return Promise.resolve({
       status: 201,
       success: true,
       lender: returnLender
     });
   } catch (error) {
     return Promise.reject(error);
   }
 } // END V1Create
