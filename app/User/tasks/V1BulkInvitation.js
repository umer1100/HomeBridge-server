'use strict';

const { WEB_HOSTNAME } = process.env;
const models = require('../../../models');

const Op = require('sequelize').Op; // for model operator aliases like $gte, $eq
const _ = require('lodash');
const joi = require('@hapi/joi');
const { joiErrorsMessage } = require('../../../services/error');
const { randomString } = require('../../../helpers/logic');
const bcrypt = require('bcrypt');
const emailService = require('../../../services/email');

module.exports = {
  V1BulkInvitation
};

async function V1BulkInvitation(job) {
  const schema = joi.object({
    users: joi.array()
      .required()
      .error(new Error('Users array is not valid'))
  });

  const { error, value } = schema.validate(job.data);
  if (error) return Promise.resolve(new Error(joiErrorsMessage(error)));
  job.data = value;

  let { users } = job.data;

  users.forEach(async (user) => {
    const userData = await models.user.findOne({
      where: {
        email: user.email,
        status: { [Op.in]: ['PENDING', 'NEW'] }
      }
    });

    if (userData) {
      const passwordToSend = randomString({ len: 10 });
      const password = bcrypt.hashSync(passwordToSend, userData.salt);
      const emailConfirmationToken = randomString();
      const emailConfirmLink = `${WEB_HOSTNAME}/ConfirmEmail?emailConfirmationToken=${emailConfirmationToken}&invitationEmail=${true}`;

      await userData.update({
        emailConfirmedToken: emailConfirmationToken,
        password: password,
        status: 'PENDING'
      });

      await emailService.send({
        from: emailService.emails.doNotReply.address,
        name: emailService.emails.doNotReply.name,
        subject: 'Please use this link to login to ownerific',
        template: 'InvitationEmail',
        tos: [user?.email],
        ccs: null,
        bccs: null,
        args: {
          emailConfirmLink,
          password: passwordToSend,
          firstName: user?.firstName,
          lastName: user?.lastName || ''
        }
      });
    }
  })
}
