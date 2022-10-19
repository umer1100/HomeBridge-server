/**
 * All Authentication and Authorization middleware goes here
 */

'use strict';

// env variables
const { NODE_ENV } = process.env;

// require custom node modules
const models = require('../models');

module.exports = {
  attachJWTAuth,
  JWTAuth,
  verifyJWTAuth
};

/**
 * Takes in the req object and attaches the JWTAuthEmployee, JWTAuthAdmin, JWTAuthEmployer
 *
 * ADD ANY MORE AUTHS HERE
 */
function attachJWTAuth(passport) {
  return (req, res, next) => {
    // Add Passport Authentications to req
    req.JWTAuth = {
      JWTAuthAdmin: passport.authenticate('JWTAuthAdmin', { session: false }),
      JWTAuthEmployer: passport.authenticate('JWTAuthEmployer', { session: false }),
      JWTAuthEmployee: passport.authenticate('JWTAuthEmployee', { session: false })
    };

    return next();
  };
}

/**
 * Looks into the request header and checks the 'authorization' header to see which auth to select
 *
 * 'authorization': 'jwt-admin token' => JWTAuthAdmin
 * 'authorization': 'jwt-employer token' => JWTAuthEmployer
 * 'authorization': 'jwt-employee token' => JWTAuthEmployee
 *
 * returns a function that will call the correct method
 *
 * ADD ANY MORE AUTHS HERE
 */
function JWTAuth(req, res, next) {
  // choose method
  if (req.headers.authorization && req.headers.authorization.indexOf('jwt-admin') >= 0) req.JWTAuth.JWTAuthAdmin(req, res, next);
  else if (req.headers.authorization && req.headers.authorization.indexOf('jwt-employer') >= 0) req.JWTAuth.JWTAuthEmployer(req, res, next);
  else if (req.headers.authorization && req.headers.authorization.indexOf('jwt-employee') >= 0) req.JWTAuth.JWTAuthEmployee(req, res, next);
  else return next();
}

/**
 * Verify that a admin/user is active during JWT auth
 * Also attach the correct user object
 * Set user's locale
 *
 * TODO: TEST
 *
 * req.user = { id, active, company:active }
 *
 * Success: Return next().
 * Errors:
 *   401: Token is invalid, request denied.
 *   401: Your account is inactive, request denied.
 */
function verifyJWTAuth(req, res, next) {
  // if logged in
  if (req.user) {
    // if logged in, set locale to user's locale
    req.setLocale(req.user.locale);
    res.setLocale(req.user.locale);

    // attach employee and remove user
    if (req.headers.authorization && req.headers.authorization.indexOf('jwt-employee') >= 0) {
      req.employee = req.user;
      req.user = null;
    }

    // attach admin and remove user
    else if (req.headers.authorization && req.headers.authorization.indexOf('jwt-admin') >= 0) {
      req.admin = req.user;
      req.user = null;
    }

    // attach employer and remove user
    else if (req.headers.authorization && req.headers.authorization.indexOf('jwt-employer') >= 0) {
      req.employer = req.user;
      req.user = null;
    }
  }

  // save the locale to the cookie in the res.cookie (final step)
  // if you change cookie name, you must also change in server.js i18n.configure
  res.cookie('i18n-locale', req.getLocale(), {
    maxAge: 999999, // about 11 days
    httpOnly: true
  });

  return next();
}
