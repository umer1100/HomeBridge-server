/**
 * Script used to create a new employer user
 *
 *
 * node scripts/create_employer_user.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env.development') });
const request = require('supertest');

const { adminLogin } = require('../helpers/tests');
const app = require('../server');
let routeVersion = '/v1';
let routePrefix = '/admin';
let routeMethod = '/login';
const adminLoginUrl = `${routeVersion}${routePrefix}${routeMethod}`;

const jwt = 'jwt-admin';

// create user request

(async () => {
  // We'll create an employer user through an Admin
  const adminEmail = 'admin-1@example.com';
  const adminPassword = 'password1';

  const { token } = await request(app).post(adminLoginUrl).send({ email: adminEmail, password: adminPassword });

  console.log(token);

  routePrefix = '/users';
  routeMethod = '/create';
  const routeUrl = `${routeVersion}${routePrefix}${routeMethod}`;

  const params = {
    firstName: 'First',
    lastName: 'Last',
    status: 'ONBOARDING',
    email: 'email@email.com',
    phone: '1234567890',
    roleType: 'EMPLOYER',
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
