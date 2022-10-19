/**
 * passport.js configuration
 */

'use strict';

// require third-party node modules
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// require custom node modules
const models = require('../models');

// extract env variables
const { SESSION_SECRET } = process.env;

// set up passport
module.exports = async passport => {
  /**********************************************/
  /***************** EMPLOYER *******************/
  /**********************************************/

  /**
   * Use local login to authenticate
   *
   * @email (STRING): Email of employer
   * @password (STRING): password of employer
   */
  passport.use(
    'JWTEmployerLogin',
    new LocalStrategy(
      {
        usernameField: 'email', // change username field to email instead of username
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        email = email.toLowerCase().trim(); // lowercase email

        process.nextTick(async () => {
          try {
            const getEmployer = await models.employer.findOne({
              paranoid: false, // This will also retrieve soft-deleted records
              where: {
                email: email
              }
            });

            // check if employer email is not found
            if (!getEmployer) return done(null, false);

            // check password
            const result = await models.employer.validatePassword(password, getEmployer.password);

            // if password is invalid
            if (!result) return done(null, null);

            // if password is valid, return employer
            return done(null, getEmployer);
          } catch (error) {
            return done(error, null);
          }
        });
      }
    )
  );

  /**
   * Use JSON WEB TOKEN via our api to authenticate employers for each request
   *
   * @payload (OBJECT): token object that contains { sub: employer.id, iat: timestamp }
   *
   * curl -v -H "Authorization: jwt-employer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNDc3MTM0NzM4fQ.Ky3iKYcguIstYPDbMbIbDR5s7e_UF0PI1gal6VX5eyI"
   */
  passport.use(
    'JWTAuthEmployer',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt-employer'), // must be from auth header for HTTPS to work, should NOT use fromHeader because it is only applied to http
        secretOrKey: SESSION_SECRET
      },
      async (payload, done) => {
        process.nextTick(async () => {
          // check if employer id is not found
          const findEmployer = await models.employer
            .findOne({
              where: {
                id: payload.sub // subject or id of employer
              }
            })
            .catch(err => done(err, null));

          return done(null, findEmployer ? findEmployer : false);
        });
      }
    )
  );

  /***********************************************/
  /******************** ADMIN ********************/
  /***********************************************/

  /**
   * Use local login to authenticate
   *
   * @email (STRING): Email of admin
   * @password (STRING): password of admin
   */
  passport.use(
    'JWTAdminLogin',
    new LocalStrategy(
      {
        usernameField: 'email', // change username field to email instead of username
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        email = email.toLowerCase().trim(); // lowercase email

        process.nextTick(async () => {
          try {
            const admin = await models.admin.findOne({
              paranoid: false, // This will also retrieve soft-deleted records
              where: {
                email: email
              }
            });

            // check if admin email is not found
            if (!admin) return done(null, false);

            // check password
            const result = await models.admin.validatePassword(password, admin.password);

            // if password is invalid
            if (!result) return done(null, null);

            // if password is valid, return admin
            return done(null, admin);
          } catch (err) {
            return done(err, null);
          }
        });
      }
    )
  );

  /**
   * Use JSON WEB TOKEN via our api to authenticate admins for each request
   *
   * @payload (OBJECT): token object that contains { sub: admin.id, iat: timestamp }
   *
   * curl -v -H "Authorization: jwt-admin eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNDc3MTM0NzM4fQ.Ky3iKYcguIstYPDbMbIbDR5s7e_UF0PI1gal6VX5eyI"
   */
  passport.use(
    'JWTAuthAdmin',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt-admin'), // must be from auth header for HTTPS to work, should NOT use fromHeader because it is only applied to http
        secretOrKey: SESSION_SECRET
      },
      async (payload, done) => {
        process.nextTick(async () => {
          // check if admin id is not found
          const admin = await models.admin
            .findOne({
              where: {
                id: payload.sub // subject or id of admin
              }
            })
            .catch(err => done(err, null));

          return done(null, admin ? admin : false);
        });
      }
    )
  );
};
