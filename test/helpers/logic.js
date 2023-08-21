/**
 * Test logic.js Helper
 */

'use strict';

// build-in node modules
const path = require('path');

// load test env
require('dotenv').config({ path: path.join(__dirname, '../../config/.env.test') });

// assertion library
const { expect } = require('chai');

// helper
const logic = require('../../helpers/logic');

describe('helpers/logic.js', () => {
  // randomString
  describe('randomString', () => {
    it('should create random string successfully', done => {
      const str = logic.randomString();
      expect(str).to.have.lengthOf(64);
      done();
    }); // END should create random string successfully

    it('should create random string with 512 characters successfully', done => {
      const str = logic.randomString({ len: 512 });
      expect(str).to.have.lengthOf(512);
      done();
    }); // END should create random string with 512 characters successfully

    it('should create random string with pre and post successfully', done => {
      const pre = 'pre-';
      const post = '-post';
      const str = logic.randomString({ pre, post });
      expect(str).to.have.lengthOf(64 + pre.length + post.length);
      expect(str).to.include(pre);
      expect(str).to.include(post);
      done();
    }); // END create random string with pre and post successfully

    it('should create random number string successfully', done => {
      const str = logic.randomString({ lowercase: false, uppercase: false, numbers: true });
      expect(str).to.have.lengthOf(64);
      for (let i = 0; i < str.length; i++) expect(Number(str[i]) < 10).to.be.true;

      done();
    }); // END create random number string successfully

    it('should create random string with just special characters successfully', done => {
      const specialCharacters = '!$/%@#'.split('');
      const str = logic.randomString({ len: 512, lowercase: false, uppercase: false, numbers: false, special: true });
      expect(str).to.have.lengthOf(512);

      for (let i = 0; i < str.length; i++) expect(specialCharacters.indexOf(str[i]) >= 0).to.be.true;

      done();
    }); // END create random number string with 512 characters successfully
  }); // END randomString

  // removeAllWhiteSpace
  describe('removeAllWhiteSpace', function () {
    it('should remove all white space, tabs and newlines successfully', done => {
      let str = '  path\t\n   over  !   \t\n';
      str = logic.removeAllWhiteSpace(str);
      expect(str).to.equal('pathover!');
      done();
    }); // END should remove all white space, tabs and newlines successfully
  }); // END removeAllWhiteSpace

  // return true if JWT is expired
  describe('isJWTExpired', function () {
    let isExpired;

    it('should return true if JWT is expired', done => {
      let TOKEN_EXPIRATION_TIME = 0;
      let token = logic.createJwtToken({ id: 1 }, 'http://localhost:8000', TOKEN_EXPIRATION_TIME);
      isExpired = logic.isJWTExpired(token);
      expect(isExpired).to.be.true;
      done();
    }); // END should return true if JWT is expired

    it('should return false if JWT is not expired', done => {
      let TOKEN_EXPIRATION_TIME = 10;
      const jwtExpiration = new Date().getTime() + parseInt(TOKEN_EXPIRATION_TIME) * 60 * 1000
      let token = logic.createJwtToken({ id: 1 }, 'http://localhost:8000', jwtExpiration);
      isExpired = logic.isJWTExpired(token);
      expect(isExpired).to.be.false;
      done();
    }); // END should return false if JWT is not expired
  }); // END isJWTExpired
}); // END helpers/logic.js
