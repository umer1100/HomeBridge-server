'use strict';

const axios = require('axios');

const { PLAID_CLIENT_ID, PLAID_CLIENT_SECRET, PLAID_CREATE_LINK_TOKEN_URL } = process.env;

module.exports = {
  V1CreateLinkToken
};

async function V1CreateLinkToken() {
  try {
    let res = await axios.post(PLAID_CREATE_LINK_TOKEN_URL, {
      user: {
        client_user_id: PLAID_CLIENT_ID
        },
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_CLIENT_SECRET,
        client_name: "Ownerific",
        products: ["auth", "transactions", "identity"],
        country_codes: ["US"],
        language: "en"
    });

    return Promise.resolve({
      status: 200,
      success: true,
      data: res.data
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
