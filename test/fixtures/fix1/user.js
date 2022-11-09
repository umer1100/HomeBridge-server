/**
 * User Fixture Data
 */

'use strict';

module.exports = [
  {
    id: 1,
    timezone: 'UTC',
    locale: 'en',
    status: 'ACTIVE',
    firstName: 'John',
    lastName: 'Doe',
    roleType: 'EMPLOYER',
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
    roleType: 'GUEST',
    email: 'user-2@example.com',
    phone: '+12408169502',
    salt: '2-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password2F%',
    emailConfirmed: true
  }
];
