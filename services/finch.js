const axios = require('axios');
const finchDirectoryUrl = 'https://api.tryfinch.com/employer/directory';
const finchIndividualUrl = 'https://api.tryfinch.com/employer/individual';
const finchCompanyUrl = 'https://api.tryfinch.com/employer/company';

module.exports = {
  getDirectory,
  getIndividuals,
  getCompany
};

async function getDirectory(hrisAccessToken) {
  let resp = await axios.get(finchDirectoryUrl, {
    headers: {
      Authorization: `Bearer ${hrisAccessToken}`,
      'Finch-API-Version': '2020-09-17'
    }
  });

  return resp.data;
}

async function getIndividuals(body, hrisAccessToken) {
  let resp = await axios.post(finchIndividualUrl, body, {
    headers: {
      Authorization: `Bearer ${hrisAccessToken}`,
      'Finch-API-Version': '2020-09-17'
    }
  });

  return resp.data;
}

async function getCompany(hrisAccessToken) {
  let resp = await axios.get(finchCompanyUrl, {
    headers: {
      Authorization: `Bearer ${hrisAccessToken}`,
      'Content-Type': 'application/json',
      'Finch-API-Version': '2020-09-17',
    }
  });

  return resp.data;
}
