/**
 * Script used to create a new resource
 *
 *
 * node scripts/create_resource.js
 */

 const path = require('path');
 require('dotenv').config({ path: path.join(__dirname, '../config/.env.development') });
 var axios = require('axios');

 const { adminLogin } = require('../helpers/tests');
 let host = 'http://localhost:8000';
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

   routePrefix = '/resources';
   routeMethod = '/create';
   const routeUrl = `${host}${routeVersion}${routePrefix}${routeMethod}`;

   // Replace the following placeholder values
   const params = {
     name: 'Resource',
     description: 'Helps buyers save money in this area',
     infoURL: 'infoURL',
     imageURL: 'imageURL',
     addresses: [{
      addressLine1: '82 5th Ave',
      addressLine2: '36A',
      city: 'New York',
      state: 'NY',
      country: 'USA',
     }]
   };

   await axios.post(routeUrl, params, { headers: { authorization: `${jwt} ${token}` } }).then(function (response) {
     console.log(response.data);
   });
   process.exit(0);
 })();
