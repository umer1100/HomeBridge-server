'use strict';

const axios = require('axios');

const { PLAID_CLIENT_ID, PLAID_CLIENT_SECRET, PLAID_CREATE_LINK_TOKEN_URL } = process.env;
const { linkTokenCreate } = require('../helper');


module.exports = {
  V1CreateLinkToken
};

async function V1CreateLinkToken() {
  const request = {
    user: {
      client_user_id: PLAID_CLIENT_ID,
    },
    client_name: 'Ownerific',
    products: ['auth', 'transactions', 'identity'],
    country_codes: ['US'],
    language: 'en',
  };

  try {
    let res = await linkTokenCreate(request);

    return Promise.resolve({
      status: 200,
      success: true,
      data: res.data
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
