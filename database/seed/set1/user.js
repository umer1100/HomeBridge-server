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
    roleType: 'ADMIN',
    firstName: 'account',
    lastName: 'owner',
    email: 'account-owner@ownerific.com',
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
    firstName: 'account',
    lastName: 'manager',
    email: 'account-manager@ownerific.com',
    phone: '+12408169501',
    salt: '1-TYIUJHGIUYGDJHGAIHGKDCHJAGKSHJDGFKGHHGEKFH',
    password: 'password1'
  }
];
