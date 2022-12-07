/**
 * Script used to create a new employer user
 *
 *
 * node scripts/create_employer_user.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env.development') });
var axios = require('axios');

const { adminLogin } = require('../helpers/tests');
let host = 'https://ownerific-api-staging.herokuapp.com';
let routeVersion = '/v1';
let routePrefix = '/admins';
let routeMethod = '/login';
const adminLoginUrl = `${host}${routeVersion}${routePrefix}${routeMethod}`;

const jwt = 'jwt-admin';

// create user request

(async () => {
  // We'll create an employer user through an Admin
  const adminEmail = 'admin-1@example.com';
  const adminPassword = 'password1';
  let token = undefined;
  await axios.post(adminLoginUrl, { email: adminEmail, password: adminPassword }).then(function (response) {
    token = response.data.token;
  });

  routePrefix = '/users';
  routeMethod = '/create';
  const routeUrl = `${host}${routeVersion}${routePrefix}${routeMethod}`;

  // Replace the following placeholder values
  const params = {
    firstName: 'John',
    lastName: 'Test',
    status: 'PENDING',
    email: 'john@ownerific.com',
    phone: '1234567890',
    roleType: 'EMPLOYER',
    organizationId: 2,
    timezone: 'America/Los_Angeles',
    locale: 'en',
    password1: 'thisisapassword1F%',
    password2: 'thisisapassword1F%',
    acceptedTerms: true
  };

  await axios.post(routeUrl, params, { headers: { authorization: `${jwt} ${token}` } }).then(function (response) {
    console.log(response.data);
  });
  process.exit(0);
})();
