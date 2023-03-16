const axios = require('axios');
const finchDirectoryUrl = 'https://api.tryfinch.com/employer/directory';
const finchIndividualUrl = 'https://api.tryfinch.com/employer/individual';
const finchCompanyUrl = 'https://api.tryfinch.com/employer/company';
const finchEmploymentUrl = 'https://api.tryfinch.com/employer/employment';
const finchIntrospectUrl = 'https://api.tryfinch.com/introspect';

module.exports = {
  getDirectory,
  getIndividuals,
  getCompany,
  getEmployments,
  getAccountInformation
};

/**
 * Finch HRIS Directory API
 *
 * Read directory and organization structure
 * @hrisAccessToken (Finch access_token)
 *
 * Docs: https://developer.tryfinch.com/docs/reference/12419c085fc0e-directory
 */

async function getDirectory(hrisAccessToken) {
  let resp = await axios.get(finchDirectoryUrl, {
    headers: {
      Authorization: `Bearer ${hrisAccessToken}`,
      'Finch-API-Version': '2020-09-17'
    }
  });

  return resp.data;
}

/**
 * Finch HRIS Individual API
 *
 * Read individual data, excluding income and employment data
 * @hrisAccessToken (Finch access_token)
 * @body Array of Individual Ids i.e,
 * "requests": [
 *   {
 *    "individual_id": "string"
 *  }
 * ]
 *
 * Docs: https://developer.tryfinch.com/docs/reference/9d6c83b09e205-individual
 */

async function getIndividuals(body, hrisAccessToken) {
  let resp = await axios.post(finchIndividualUrl, body, {
    headers: {
      Authorization: `Bearer ${hrisAccessToken}`,
      'Finch-API-Version': '2020-09-17'
    }
  });

  return resp.data;
}

/**
 * Finch HRIS Company API
 *
 * Read basic company data
 * @hrisAccessToken (Finch access_token)
 *
 * Docs: https://developer.tryfinch.com/docs/reference/33162be1eed72-company
 */

async function getCompany(hrisAccessToken) {
  let resp = await axios.get(finchCompanyUrl, {
    headers: {
      Authorization: `Bearer ${hrisAccessToken}`,
      'Content-Type': 'application/json',
      'Finch-API-Version': '2020-09-17'
    }
  })

  return resp.data;
}

/**
 * Finch HRIS Employment API
 *
 * Read individual employment and income data
 * @hrisAccessToken (Finch access_token)
 * @body Array of Individual Ids i.e,
 * "requests": [
 *   {
 *    "individual_id": "string"
 *  }
 * ]
 *
 * Docs: https://developer.tryfinch.com/docs/reference/1ba5cdec4c979-employment
 */

async function getEmployments(body, hrisAccessToken) {
  let resp = await axios.post(finchEmploymentUrl, body, {
    headers: {
      Authorization: `Bearer ${hrisAccessToken}`,
      'Finch-API-Version': '2020-09-17'
    }
  });

  return resp.data;
}

/**
 * Finch HRIS Account API
 *
 * Read basic account data
 * @hrisAccessToken (Finch access_token)
 *
 * Docs: https://developer.tryfinch.com/docs/reference/eee6e798b0f93-introspect
 */

 async function getAccountInformation(hrisAccessToken) {
  let resp = await axios.get(finchIntrospectUrl, {
    headers: {
      Authorization: `Bearer ${hrisAccessToken}`,
      'Content-Type': 'application/json',
      'Finch-API-Version': '2020-09-17'
    }
  });

  return resp.data;
}
