/**
 * Resource V1Create ACTION
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
  * Create a resource
  *
  * GET  /v1/resources/create
  * POST /v1/resources/create
  *
  * Must be logged out
  * Roles: []
  *
  * req.params = {}
  * req.args = {
  *   @firstName - (STRING - REQUIRED): The first name of the new resource
  *   @lastName - (STRING - REQUIRED): The last name of the new resource
  *   @email - (STRING - REQUIRED): The email of the resource
  *   @phone - (STRING - REQUIRED): The phone of the resource
  *   @addressline1 - (STRING - OPTIONAL): The first line of the address of the resource
  *   @addressline2 - (STRING - OPTIONAL): The second line of the address of the resource
  *   @city - (STRING - OPTIONAL): The city of the address of the resource
  * }
  *
  * Success: Return an resource
  * Errors:
  *   400: BAD_REQUEST_INVALID_ARGUMENTS
  *   400: RESOURCE_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED
  *   400: RESOURCE_BAD_REQUEST_RESOURCE_ALREADY_EXISTS
  *   400: RESOURCE_BAD_REQUEST_INVALID_TIMEZONE
  *   401: UNAUTHORIZED
  *   500: INTERNAL_SERVER_ERROR
  */
 async function V1Create(req) {
   const schema = joi.object({
     name: joi.string().trim().min(1).required(),
     description: joi.string().trim().min(1).required(),
     imageURL: joi.string().trim().min(1),
     infoURL: joi.string().trim().min(1),
     addresses: joi.array().items(joiAddressSchema())
   });
   // validate
   const { error, value } = schema.validate(req.args);

   if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
   req.args = value; // updated arguments with type conversion

   try {
     // check if resource email already exists
     const duplicateResource = await models.resource.findOne({
       where: {
         name: req.args.name
       }
     });

     // check of duplicate resource resource
     if (duplicateResource) return Promise.resolve(errorResponse(req, ERROR_CODES.RESOURCE_BAD_REQUEST_RESOURCE_ALREADY_EXISTS));

     // create resource
     const newResource = await models.resource.create({
       name: req.args.name,
       description: req.args.description,
       imageURL: req.args.imageURL,
       infoURL: req.args.infoURL
     });

     if (req.args.addresses?.length > 0) {
      await Promise.all(
        req.args.addresses.map(async request => {
          await newResource.createAddress(request);
        })
      )
     }

     // grab resource without sensitive data
     const returnResource = await models.resource
       .findByPk(newResource.id, {
        include: {
          model: models.address
        }
      })
       .catch(err => {
         newResource.destroy(); // destroy if error
         return Promise.reject(err);
       }); // END grab partner without sensitive data

     // return
     return Promise.resolve({
       status: 201,
       success: true,
       resource: returnResource
     });
   } catch (error) {
     return Promise.reject(error);
   }
 } // END V1Create
