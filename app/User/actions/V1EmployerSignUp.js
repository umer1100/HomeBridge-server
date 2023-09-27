/**
 * USER V1EmployerSignUp ACTION
 */

'use strict'

const { WEB_HOSTNAME } = process.env
const joi = require('@hapi/joi')

const models = require('../../../models.js')
const conn = require('../../../database/index.js')
const emailService = require('../../../services/email')
const { ROLE } = require('../../../helpers/constants.js')
const { randomString } = require('../../../helpers/logic')
const { PASSWORD_REGEX, PASSWORD_LENGTH_MIN } = require('../../../helpers/constants')
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error')

module.exports = {
  V1EmployerSignUp
}

/**
 * Sign Up as an employer
 *
 * POST /v1/users/employer/signUp
 *
 * Must be logged out
 * Roles: []
 *
 * req.params = {}
 * req.args = {
 *  @firstName - (STRING - REQUIRED): The first name of the employer
 *  @lastName - (STRING - REQUIRED): The last name of the employer
 *  @email - (STRING - REQUIRED): The work email of the employer
 *  @companyName - (STRING - REQUIRED): Name of the company
 *  @companyPhoneNumber - (STRING - REQUIRED): The phone of the company
 *  @password - (STRING - REQUIRED): The unhashed password of the user
 *  @confirmPassword - (STRING - REQUIRED): The unhashed confirmPassword of the user
 * }
 *
 * Success: Sends email to employer
 * Errors:
 *   500: INTERNAL_SERVER_ERROR
 */
async function V1EmployerSignUp(req, res) {
  const userSchema = joi.object({
    firstName: joi.string().trim().min(1).required(),
    lastName: joi.string().trim().min(1).required(),
    email: joi.string().trim().lowercase().min(3).email().required(),
    companyName: joi.string().trim().min(1).required(),
    companyPhoneNumber: joi.string().trim().min(1).required(),
    companyURL: joi.string().trim().min(1).required(),
    password: joi
      .string()
      .min(PASSWORD_LENGTH_MIN)
      .regex(PASSWORD_REGEX)
      .required()
      .error(new Error(req.__('USER[Invalid Password Format]'))),
    confirmPassword: joi
      .string()
      .min(PASSWORD_LENGTH_MIN)
      .regex(PASSWORD_REGEX)
      .required()
      .error(new Error(req.__('USER[Invalid Password Format]')))
  })

  const { error, value } = userSchema.validate(req.args)
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)))

  const { firstName, lastName, email, companyName, companyPhoneNumber, password, confirmPassword, companyURL } = req.args
  if (password !== confirmPassword) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_PASSWORDS_NOT_EQUAL))
  req.args = value

  const transaction = await conn.transaction()
  try {
    const duplicateUser = await models.user.findOne({
      where: {
        email
      }
    })

    const duplicateOrganization = await models.organization.findOne({
      where: {
        url: companyURL
      }
    })

    if (duplicateOrganization) return Promise.resolve(errorResponse(req, ERROR_CODES.ORGANIZATION_BAD_REQUEST_ORGANIZATION_ALREADY_EXISTS))
    if (duplicateUser) return Promise.resolve(errorResponse(req, ERROR_CODES.USER_BAD_REQUEST_USER_ALREADY_EXISTS))

    const organization = await models.organization.create({
      name: companyName,
      phone: companyPhoneNumber,
      url: companyURL
    }, { transaction })

    const newUser = await models.user.create({
      firstName,
      lastName,
      email,
      password,
      roleType: ROLE.EMPLOYER,
      organizationId: organization.id
    }, { transaction })

    const emailConfirmationToken = randomString()
    const emailConfirmLink = `${WEB_HOSTNAME}/ConfirmEmail?emailConfirmationToken=${emailConfirmationToken}`
    await emailService.send({
      from: emailService.emails.doNotReply.address,
      name: emailService.emails.doNotReply.name,
      subject: 'Email Confirmation',
      template: 'ConfirmEmail',
      tos: [email],
      ccs: null,
      bccs: null,
      args: {
        emailConfirmLink
      }
    }).catch(err => {
      newUser.destroy()
      return Promise.reject(err)
    })
    await newUser.update(
      {
        emailConfirmedToken: emailConfirmationToken
      },
      {
        fields: ['emailConfirmedToken'],
        where: {
          email
        },
        transaction
      }
    )
    await transaction.commit()

    return Promise.resolve({
      status: 201,
      success: true,
      message: `An account confirmation email has been sent to ${email}. Please check your email.`
    })
  } catch (error) {
    return Promise.reject(error)
  }
} // END V1EmployerSignUp
