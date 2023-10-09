/**
 * User V1CreateByOrganizationalUser ACTION
 */

'use strict';

// ENV variables
const { WEB_HOSTNAME } = process.env;

// third-party
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md

// services
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');
const emailService = require('../../../services/email');

// models
const models = require('../../../models');

// helpers
const { isValidRoleAction } = require('../../../helpers/validate');
const { PASSWORD_LENGTH_MIN, PASSWORD_REGEX } = require('../../../helpers/constants');
const { randomString } = require('../../../helpers/logic');

// methods
module.exports = {
  V1CreateByOrganizationalUser
};

/**
 * Create an user
 *
 * GET  /v1/users/create
 * POST /v1/users/create
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *   @firstName - (STRING - REQUIRED): The first name of the new user
 *   @middleName - (STRING - OPTIONAL): The middle name of the new user
 *   @lastName - (STRING - REQUIRED): The last name of the new user
 *   @status - (STRING - DEFAULT('PENDING')): Status of the user
 *   @email - (STRING - REQUIRED): The email of the user,
 *   @phone - (STRING - OPTIONAL): Phone number of user
 *   @roleType - (STRING - REQUIRED): The role type of the user
 *   @organizationId - (NUMBER - DEFAULT(user.organizationId)): The Organization Id of user
 *   @timezone - (STRING - OPTIONAL): Timezone of user
 *   @locale - (STRING - OPTIONAL): Locale of user
 *   @password1 - (STRING - OPTIONAL) Password of the user
 *   @password2 - (STRING - OPTIONAL) Confirm password of the user
 *   @acceptedTerms - (BOOLEAN - OPTIONAL) Is user accept Term
 *   @kycIdType - (STRING - OPTIONAL) kycIdType of user
 *   @kycIdNumber - (STRING - OPTIONAL) kycIdNumber of user
 *   @addressline1 - (STRING - OPTIONAL) Address line 1 of the User
 *   @addressline2 - (STRING - OPTIONAL) Address line 2 of the user
 *   @city - (STRING - OPTIONAL) city of the user
 *   @state - (STRING - OPTIONAL) state of the user
 *   @country - (STRING - OPTIONAL) country of the user
 *   @zipcode - (STRING - OPTIONAL) zip code of the user
 *   @dateOfBirth - (DATE - OPTIONAL) Date of birth of the user
 * }
 *
 * Success: Return an user
 * Errors:
 *   400: BAD_REQUEST_INVALID_ARGUMENTS
 *   400: USER_BAD_REQUEST_TERMS_OF_SERVICE_NOT_ACCEPTED
 *   400: USER_BAD_REQUEST_USER_ALREADY_EXISTS
 *   400: USER_BAD_REQUEST_INVALID_TIMEZONE
 *   401: UNAUTHORIZED
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1CreateByOrganizationalUser(req) {
  const userSchema = joi.object({
    firstName: joi.string().trim().min(1).required(),
    middleName: joi.string().trim().allow('').optional(),
    lastName: joi.string().trim().min(1).required(),
    status: joi.string().default('PENDING'),
    email: joi.string().trim().lowercase().min(3).email().required(),
    phone: joi.string().trim(),
    roleType: joi.string().trim().required(),
    organizationId: joi.number().integer().default(req.user.organizationId).min(1),
    timezone: joi.string().min(1),
    locale: joi.string().min(1),
    password1: joi
      .string()
      .min(PASSWORD_LENGTH_MIN)
      .regex(PASSWORD_REGEX)
      .error(new Error(req.__('USER[Invalid Password Format]'))),
    password2: joi
      .string()
      .min(PASSWORD_LENGTH_MIN)
      .regex(PASSWORD_REGEX)
      .error(new Error(req.__('USER[Invalid Password Format]'))),
    acceptedTerms: joi.boolean(),
    kycIdType: joi.string().min(1).trim(),
    kycIdNumber: joi.string().min(1).trim(),
    addressline1: joi.string().trim().min(1),
    addressline2: joi.string().trim().min(1),
    city: joi.string().trim().min(1),
    state: joi.string().trim().min(1),
    country: joi.string().trim().min(1),
    zipcode: joi.string().trim().min(1),
    dateOfBirth: joi.date()
  });

  const schema = joi.object({
    users: joi.array().items(userSchema).min(1).required()
  });
  // validate
  const { error, value } = schema.validate(req.args);

  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value; // updated arguments with type conversion

  try {
    // check if user email already exists
    let duplicateUser = false;

    await Promise.all(req.args.users.map(async (user) => {
      const existingUser = await models.user.findOne({
        where: {
          email: user.email
        }
      });
      existingUser ? duplicateUser = true : null

      // validate roleType
      if (!isValidRoleAction(req.user.roleType, user.roleType)) return Promise.resolve(errorResponse(req, ERROR_CODES.UNAUTHORIZED));
    }));

    // check of duplicate user user
    if (duplicateUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_USER_ALREADY_EXISTS));

    // create user
    await Promise.all(req.args.users.map(async (user) => {
      // Generating Random Password
      const password = randomString({ len: 10 })
      // preparing for email confirmation token
      const emailConfirmationToken = randomString()

      const newUser = await models.user.create({
        timezone: user.timezone,
        locale: user.locale,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        status: user.status,
        email: user.email,
        phone: user.phone,
        roleType: user.roleType,
        organizationId: req.user.organizationId,
        password: password,
        acceptedTerms: user.acceptedTerms,
        addressline1: user.addressline1,
        addressline2: user.addressline2,
        city: user.city,
        state: user.state,
        country: user.country,
        zipcode: user.zipcode,
        dateOfBirth: user.dateOfBirth,
        source: 'Manual',
        emailConfirmedToken: emailConfirmationToken,
      });

      // create URL using front end url
      const emailConfirmLink = `${WEB_HOSTNAME}/ConfirmEmail?emailConfirmationToken=${emailConfirmationToken}&invitationEmail=${true}`;

      // sending email with invitation token and password
      await emailService.send({
        from: emailService.emails.doNotReply.address,
        name: emailService.emails.doNotReply.name,
        subject: 'Welcome to Ownerific',
        template: 'InvitationEmail',
        tos: [user.email],
        ccs: null,
        bccs: null,
        args: {
          emailConfirmLink,
          password,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }).catch(err => {
        newUser.destroy(); // destroy if error
        return Promise.reject(err);
      });
    }))
    // return
    return Promise.resolve({
      status: 201,
      success: true,
    });
  } catch (error) {
    return Promise.reject(error);
  }
} // END V1Create