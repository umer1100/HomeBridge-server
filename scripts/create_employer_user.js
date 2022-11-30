/**
 * Script used to create a new employer user
 *
 * Remember to set database url
 *
 * node scripts/create_organization.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env.development') });
const request = require('supertest');

const { adminLogin } = require('../helpers/tests');
const app = require('../server');
const routeVersion = '/v1';
const routePrefix = '/users';
const routeMethod = '/create';
const routeUrl = `${routeVersion}${routePrefix}${routeMethod}`;

const jwt = 'jwt-admin';

// create user request

(async () => {
  // We'll create an employer user through an Admin
  const adminFix = require('../test/fixtures/fix1/admin');
  const { token } = await adminLogin(app, routeVersion, request, adminFix[0]);

  const params = {
    firstName: 'First',
    lastName: 'Last',
    status: 'ACTIVE',
    email: 'email@email.com',
    phone: '1234567890',
    roleType: 'Employer',
    organizationId: 1,
    timezone: 'America/Los_Angeles',
    locale: 'en',
    password1: 'thisisapassword1F%',
    password2: 'thisisapassword1F%',
    acceptedTerms: true
  };

  const res = await request(app).post(routeUrl).set('authorization', `${jwt} ${token}`).send(params);
  console.log(res.text);
  process.exit(0);
})();
