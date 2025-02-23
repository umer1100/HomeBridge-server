var Client = require('dwolla-v2').Client;
var dwolla = new Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
  environment: process.env.DWOLLA_APP_ENVIRONMENT
});

module.exports = {
  createDwollaCustomer,
  createDwollaCustomerFundingSource,
  removeDwollaFundingSource,
  transferFunds,
  readTransactions
};

/**
 * create Dwolla Customer and obtain customer url
 *
 * @param firstName
 * @param lastName
 * @param ssn
 * @param email
 * @param address1
 * @param city
 * @param state
 * @param postalCode
 * @param dateOfBirth
 * @returns Dwolla link referring to customer
 */
async function createDwollaCustomer({ firstName, lastName, ssn, email, addressLine1, city, state, zipcode, dateOfBirth }) {
  try {
    // Check to see if customer already exists, and if so return that customer's URL
    let search = await dwolla.get('customers', { email: email });
    let doesExist = search.body._embedded.customers.find(x => x.status == 'verified');
    if (doesExist) return doesExist._links.self.href;

    const requestBody = {
      firstName,
      lastName,
      email,
      type: 'personal',
      address1: addressLine1,
      city,
      state,
      postalCode: zipcode,
      dateOfBirth,
      ssn
    };
    const response = await dwolla.post('customers', requestBody);
    return response.headers.get('Location');
  } catch (error) {
    return Promise.reject(
      error?.body?._embedded?.errors.map(error => error?.message) ||
      JSON.parse(error?.message)?.message ||
      error
    );
  }
}

/**
 * Send processor token to Dwolla customer url to create customer Funding source and obtain customer funding source url
 *
 * @param account
 * @param customerUrl
 * @param processorToken
 * @returns dwolla url referring to a customer's account
 */
async function createDwollaCustomerFundingSource(account, customerUrl, processorToken) {
  try {
    let requestBody = {
      plaidToken: processorToken,
      name: account.subtype
    };

    const response = await dwolla.post(`${customerUrl}/funding-sources`, requestBody);
    return response.headers.get('Location');
  } catch (error) {
    return Promise.reject(
      error?.body?._embedded?.errors.map(error => error?.message) ||
      JSON.parse(error?.message)?.message ||
      error
    );
  }
}

/**
 * Deletes the funding source for a customer
 *
 * @param fundingSourceUrl
 */
async function removeDwollaFundingSource(fundingSourceUrl) {
  try {
    let requestBody = {
      removed: true
    };

    await dwolla.post(fundingSourceUrl, requestBody);
  } catch (error) {
    return Promise.reject(
      error?.body?._embedded?.errors.map(error => error?.message) ||
      JSON.parse(error?.message)?.message ||
      error
    );
  }
}

/**
 *
 * Read Transactions of a customer
 *
 * @param customerUrl - Customer Url to fetch all transactions of that customer
 * @returns record of Transactions
 */
async function readTransactions(customerUrl) {
  try {
    return await dwolla.get(`${customerUrl}/transfers`)
  } catch (error) {
    return Promise.reject(
      error?.body?._embedded?.errors.map(error => error?.message) ||
      JSON.parse(error?.message)?.message ||
      error
    );
  }
}

/**
 *
 * Transfers money between two accounts using dwolla
 *
 * @param sourcedLink - where the money is coming from (dwolla link)
 * @param fundedLink - where the money is going to (dwolla link)
 * @param amount - the amount of money being transferred
 * @returns link referring to record of transaction
 */
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
  try {
    let resp = await dwolla.post('transfers', requestBody); // => 'https://api.dwolla.com/transfers/d76265cd-0951-e511-80da-0aa34a9b2388'

    return resp.headers.get('Location');
  } catch (error) {
    return Promise.reject(
      error?.body?._embedded?.errors.map(error => error?.message) ||
      JSON.parse(error?.message)?.message ||
      error
    );
  }
}
