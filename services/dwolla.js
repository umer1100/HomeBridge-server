var Client = require('dwolla-v2').Client;
var appToken = new Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
  environment: 'sandbox' // defaults to 'production'
});

module.exports = {
  createDwollaCustomer,
  createDwollaCustomerFundingSource
};

// create Dwolla Customer and obtain customer url
async function createDwollaCustomer(firstName, lastName, ssn, email, address1, city, state, postalCode, dateOfBirth) {
  try {
    const requestBody = {
      firstName,
      lastName,
      email,
      type: 'personal',
      address1,
      city,
      state,
      postalCode,
      dateOfBirth,
      ssn
    };
    const response = await dwolla.post('customers', requestBody);
    return response.headers.location;
  } catch (error) {
    console.log('error:', error);
    res.status(500);
  }
}

// send processor token to Dwolla customer url to create customer Funding source and obtain customer funding source url
async function createDwollaCustomerFundingSource(account, customerUrl, processorToken) {
  try {
    const response = await axios.post(
      `${customerUrl}/funding-sources`,
      {
        plaidToken: processorToken,
        name: account.subtype
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${DWOLLA_ACCESS_TOKEN}`,
          Accept: 'application/vnd.dwolla.v1.hal+json'
        }
      }
    );
    return response.headers.location;
  } catch (error) {
    console.log('error:', error);
    res.status(500);
  }
}

var Client = require('dwolla-v2').Client;
const dwolla = new Client({
  environment: 'sandbox', // Defaults to "production"
  key: 'aA8qBpHoyUiovcmIUAnZugUfRj7FrybCCoIliZK21857X4tYZz',
  secret: '7Ychcka2BSxqnRkdn1MKaPiDjKYu4VFnplrIGZXMmWTkkwonpn'
});
