/**
 * User Seed Data
 */

'use strict';

module.exports = [
  {
    id: 1,
    timezone: 'UTC',
    locale: 'en',
    active: true,
    roleType: 'EMPLOYER',
    firstName: 'President',
    lastName: 'Boss',
    email: 'employer@ownerific.com',
    phone: '+12408169501',
    salt: '1-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password1'
  },
  {
    id: 2,
    timezone: 'UTC',
    locale: 'en',
    active: true,
    roleType: 'EMPLOYEE',
    firstName: 'Entry',
    lastName: 'Worker',
    email: 'employee@ownerific.com',
    phone: '+12408169501',
    salt: '1-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password2'
  }
];
