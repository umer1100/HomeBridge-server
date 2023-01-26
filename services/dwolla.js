var Client = require('dwolla-v2').Client;
var appToken = new Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
  environment: 'sandbox' // defaults to 'production'
});

module.exports = {
  createDwollaCustomer,
  createDwollaCustomerFundingSource,
  transferFunds
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
    return response.headers.get('Location');
  } catch (error) {
    console.log('error:', error);
    if (error._embedded.errors[0].code === 'Duplicate') return error._embedded.errors[0]._links.about.href;
  }
}

// send processor token to Dwolla customer url to create customer Funding source and obtain customer funding source url
async function createDwollaCustomerFundingSource(account, customerUrl, processorToken) {
  try {
    let requestBody = {
      plaidToken: processorToken,
      name: account.subtype
    };

    const response = await dwolla.post(`${customerUrl}/funding-sources`, requestBody);
    return response.headers.get('Location');
  } catch (error) {
    console.log('error:', error);
  }
}

async function transferFunds(sourcedLink, fundedLink, amount) {
  var requestBody = {
    _links: {
      source: {
        href: sourcedLink
      },
      destination: {
        href: fundedLink
      }
    },
    amount: {
      currency: 'USD',
      value: amount
    }
  };

  // For Dwolla API applications, an dwolla can be used for this endpoint. (https://developers.dwolla.com/api-reference/authorization/application-authorization)
  let resp = await dwolla.post('transfers', requestBody); // => 'https://api.dwolla.com/transfers/d76265cd-0951-e511-80da-0aa34a9b2388'
  return resp.headers.get('Location');
}

var Client = require('dwolla-v2').Client;
const dwolla = new Client({
  environment: 'sandbox', // Defaults to "production"
  key: 'aA8qBpHoyUiovcmIUAnZugUfRj7FrybCCoIliZK21857X4tYZz',
  secret: '7Ychcka2BSxqnRkdn1MKaPiDjKYu4VFnplrIGZXMmWTkkwonpn'
});
