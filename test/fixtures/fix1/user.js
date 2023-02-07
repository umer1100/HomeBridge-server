/**
 * User Fixture Data
 */

'use strict';

const { randomString } = require("../../../helpers/logic");

module.exports = [
  {
    id: 1,
    timezone: 'UTC',
    locale: 'en',
    status: 'ACTIVE',
    firstName: 'John',
    lastName: 'Doe',
    roleType: 'EMPLOYER',
    organizationId: 1,
    email: 'user-1@example.com',
    phone: '+12408169501',
    salt: '1-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password1F%',
    emailConfirmed: true
  },
  {
    id: 2,
    timezone: 'UTC',
    locale: 'en',
    status: 'ACTIVE',
    firstName: 'Jane',
    lastName: 'Chen',
    roleType: 'ADMIN',
    organizationId: 1,
    email: 'user-2@example.com',
    phone: '+12408169502',
    salt: '2-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password2F%',
    emailConfirmed: true
  },
  {
    id: 3,
    timezone: 'UTC',
    locale: 'en',
    status: 'ACTIVE',
    firstName: 'Malik',
    lastName: 'Abu',
    roleType: 'MANAGER',
    organizationId: 1,
    email: 'user-3@example.com',
    phone: '+19173838123',
    salt: '2-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password3F%',
    emailConfirmed: true
  },
  {
    id: 4,
    timezone: 'UTC',
    locale: 'en',
    status: 'ACTIVE',
    firstName: 'Gorang',
    lastName: 'Pall',
    roleType: 'EMPLOYEE',
    organizationId: 1,
    email: 'user-4@example.com',
    phone: '+17039198188',
    salt: '2-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password4F%',
    emailConfirmed: true
  },
  {
    id: 5,
    timezone: 'UTC',
    locale: 'en',
    status: 'ACTIVE',
    firstName: 'Erik',
    lastName: 'Lewandoski',
    roleType: 'GUEST',
    email: 'user-5@example.com',
    phone: '+13018148502',
    organizationId: 2,
    salt: '2-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password5F%',
    emailConfirmed: true
  },
  {
    id: 6,
    timezone: 'UTC',
    locale: 'en',
    status: 'PENDING',
    firstName: 'Ehsan',
    lastName: 'Atif',
    roleType: 'GUEST',
    email: 'ehsan-atif@example.com',
    phone: '+13018148502',
    salt: '2-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password5F%',
    emailConfirmed: false,
    emailConfirmedToken: randomString()
  },
  {
    id: 7,
    timezone: 'UTC',
    locale: 'en',
    status: 'PENDING',
    firstName: 'John',
    lastName: 'Leo',
    roleType: 'EMPLOYEE',
    email: 'user-7@example.com',
    phone: '+13018148502',
    salt: '2-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password5F%',
    emailConfirmed: false,
    emailConfirmedToken: randomString()
  },
];
