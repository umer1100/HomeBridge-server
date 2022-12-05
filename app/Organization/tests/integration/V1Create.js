/**
 * TEST ORGANIZATION V1CreateByEAdmin METHOD
 */

'use strict';

// build-in node modules
const path = require('path');

// load test env
require('dotenv').config({ path: path.join(__dirname, '../../../../config/.env.test') });

// third party
const i18n = require('i18n'); // https://github.com/mashpie/i18n-node

// server & models
const app = require('../../../../server');
const models = require('../../../../models');

// assertion library
const { expect } = require('chai');
const request = require('supertest');

// services
const { errorResponse, ERROR_CODES } = require('../../../../services/error');

// helpers
const { adminLogin, reset, populate } = require('../../../../helpers/tests');
const organization = require('../../../../test/fixtures/fix1/organization');

describe('Organization.V1Create', async () => {
  // url of the api method we are testing
  const routeVersion = '/v1';
  const routePrefix = '/organizations';
  const routeMethod = '/create';
  const routeUrl = `${routeVersion}${routePrefix}${routeMethod}`;

  // clear database
  beforeEach(async () => {
    await reset();
  });

  // Logged Out
  describe('Role: Logged Out', async () => {
    // populate database with fixtures
    beforeEach(async () => {
      await populate('fix1');
    });

    it('[logged-out] should create an organization successfully', async () => {
      try {
        const params = {
          name: 'Company Inc.',
          active: true,
          email: 'new-admin@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          url: 'www.random-url.com'
        };

        // create organization request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(201);
        expect(res.body.organization.id).to.equal(organization.length + 1);
        expect(res.body.organization.timezone).to.equal(params.timezone);
        expect(res.body.organization.locale).to.equal(params.locale);
        expect(res.body.organization.active).to.be.true;
        expect(res.body.organization.name).to.equal(params.name);
        expect(res.body.organization.email).to.equal(params.email);
        expect(res.body.organization.phone).to.equal(params.phone);
        expect(res.body.organization.url).to.equal(params.url);
        expect(res.body.organization.createdAt).to.be.a('string');
        expect(res.body.organization.updatedAt).to.be.a('string');

        // check if organization was created
        const checkOrganization = await models.organization.findByPk(res.body.organization.id);
        expect(checkOrganization.name).to.equal(params.name);
        expect(checkOrganization.timezone).to.equal(params.timezone);
        expect(checkOrganization.locale).to.equal(params.locale);
        expect(checkOrganization.active).to.be.true;
        expect(checkOrganization.name).to.equal(params.name);
        expect(checkOrganization.email).to.equal(params.email);
        expect(checkOrganization.phone).to.equal(params.phone);
        expect(checkOrganization.url).to.equal(params.url);
        expect(checkOrganization.createdAt).to.not.be.null;
        expect(checkOrganization.updatedAt).to.not.be.null;
      } catch (error) {
        throw error;
      }
    });

    it('should not create new organization if already exists', async () => {
      try {
        const params1 = {
          name: 'Company Inc.',
          active: true,
          email: 'new-admin@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          url: 'www.random-url.com'
        };

        // create organization request
        await request(app).post(routeUrl).send(params1);

        const params2 = {
          name: 'Company Inc.',
          active: true,
          email: 'organization-1@example.com',
          phone: '+12406206950',
          timezone: 'America/Los_Angeles',
          locale: 'en',
          url: 'www.random-url.com'
        };

        // create organization request with same url request
        const res = await request(app).post(routeUrl).send(params2);
        expect(res.statusCode).to.equal(201);

        const getOrganizationsCount = await models.organization.count({
          where: {
            name: 'Company Inc.',
            url: 'www.random-url.com'
          }
        });

        expect(getOrganizationsCount).to.equal(1);
      } catch (error) {
        throw error;
      }
    });

    it('should not create new organization if name is missing', async () => {
      try {
        const res = await request(app).get(routeUrl);

        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('"name" is required');
      } catch (error) {
        throw error;
      }
    });

    it('should not create new organization if url is missing', async () => {
      try {
        const params = {
          name: 'Company Inc.',
          active: true,
          email: 'new-organization@example.com',
          phone: '+12406206950',
          timezone: 'invalid-timezone',
          locale: 'en'
        };

        // create admin request
        const res = await request(app).post(routeUrl).send(params);

        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('"url" is required');
      } catch (error) {
        throw error;
      }
    });
  }); // END Role: Logged Out
}); // END Organization.V1Create
