/**
 * User Seed Data
 */

'use strict';
const { randomString } = require('../../../helpers/logic');

module.exports = [
  {
    id: 1,
    timezone: 'UTC',
    locale: 'en',
    status: 'ACTIVE',
    roleType: 'EMPLOYER',
    firstName: 'President',
    lastName: 'Boss',
    email: 'employer@ownerific.com',
    phone: '+12408169501',
    salt: '1-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password1',
    emailConfirmed: true,
    emailConfirmedToken: randomString()
  },
  {
    id: 2,
    timezone: 'UTC',
    locale: 'en',
    status: 'ACTIVE',
    roleType: 'EMPLOYEE',
    firstName: 'Entry',
    lastName: 'Worker',
    email: 'employee@ownerific.com',
    phone: '+12408169501',
    salt: '1-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password2',
    emailConfirmed: true,
    emailConfirmedToken: randomString()
  }
];
