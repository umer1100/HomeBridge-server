/**
 * USER MODEL
 *
 * Find Table Schema Here: "/database/schema.sql"
 *
 * -- Users TABLE --
 * CREATE TYPE SEXTYPE AS ENUM ('MALE', 'FEMALE', 'OTHER');
 * CREATE TYPE KYCIDTYPE AS ENUM ('SSN', 'PASSPORT');
 * CREATE TABLE IF NOT EXISTS Users (
 *   id BIGSERIAL PRIMARY KEY NOT NULL,
 *
 *   organizationId BIGINT DEFAULT NULL REFERENCES Organizations(id),
 *
 *   timezone STRING NOT NULL DEFAULT 'UTC',
 *   locale STRING NOT NULL DEFAULT 'en',
 *   status STRING NOT NULL DEFAULT TRUE,
 *   sex SEXTYPE DEFAULT NULL,
 *   roleType STRING NOT NULL,
 *
 *   -- Following values are necessary for KYC
 *   firstName STRING NOT NULL,
 *   middleName STRING DEFAULT NULL,
 *   lastName STRING NOT NULL,
 *   email STRING NOT NULL UNIQUE,
 *   phone STRING DEFAULT NULL,
 *   kycIdType KYCIDTYPE DEFAULT NULL,
 *   kycIdNumber INT DEFAULT NULL,
 *   addressLine1 TEXT DEFAULT NULL,
 *   addressLine2 TEXT DEFAULT NULL,
 *   city TEXT DEFAULT NULL,
 *   state TEXT DEFAULT NULL,
 *   country TEXT DEFAULT NULL,
 *   zipcode TEXT DEFAULT NULL,
 *   dateOfBirth TIMESTAMP WITHOUT TIME ZONE DEFAULT NUll,
 *   -- End KYC
 *
 *
 *   salt TEXT NOT NULL, -- random salt value
 *   password TEXT NOT NULL, -- hashed password
 *   passwordResetToken TEXT DEFAULT NULL UNIQUE,
 *   passwordResetExpire TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
 *   emailConfirmed BOOLEAN NOT NULL DEFAULT FALSE,
 *   emailConfirmationToken TEXT DEFAULT NULL UNIQUE,
 *   emailResetToken TEXT DEFAULT NULL UNIQUE,
 *   resetEmail TEXT DEFAULT NULL, -- must check email if this email already exists both when this is created and when this is about to change email
 *   acceptedTerms BOOLEAN NOT NULL DEFAULT TRUE, -- whether this user accepted our terms / services
 *   loginCount INT NOT NULL DEFAULT 0,
 *   lastLogin TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
 *
 *   primaryGoal TEXT DEFAULT NULL
 *   goalTimeline TEXT DEFAULT NULL
 *
 *   finchId TEXT DEFAULT NULL,
 *
 *   -- Autogenerated by Sequelize
 *   deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
 *   createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
 *   updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
 * );
 */

'use strict';

// require custom node modules
const bcrypt = require('bcrypt');
const { reject } = require('lodash');
const passport = require('passport');
const constants = require('../../helpers/constants');
const { randomString } = require('../../helpers/logic');
const models = require('../../models');

// sensitive data that should not be exposed
const sensitiveData = ['salt', 'password', 'passwordResetToken'];

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      // All foreign keys are added in associations

      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'UTC'
      },

      locale: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'en'
      },

      status: {
        type: DataTypes.ENUM(['PENDING', 'ACTIVE', 'INACTIVE', 'ONBOARDING', 'NEW', 'PAUSE']),
        allowNull: false,
        defaultValue: 'NEW'
      },

      previousStatus: {
        type: DataTypes.ENUM(['PENDING', 'ACTIVE', 'INACTIVE', 'ONBOARDING', 'NEW', 'PAUSE']),
        allowNull: true,
        defaultValue: null
      },

      sex: {
        type: DataTypes.ENUM(['MALE', 'FEMALE', 'OTHER']),
        allowNull: true
      },

      roleType: {
        type: DataTypes.STRING,
        allowNull: false
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },

      middleName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // The unique email of the user
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },

      // The unique phone of the user
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      // The KYC id type, can be either social security number or passport
      kycIdType: {
        type: DataTypes.ENUM(['SSN', 'PASSPORT']),
        allowNull: true
      },

      // The KYC id number
      kycIdNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },

      addressLine1: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      addressLine2: {
        type: DataTypes.TEXT,
        defaultValue: '',
        allowNull: false
      },

      city: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      state: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      country: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      zipcode: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true
      },

      // salt should be randomly generate
      salt: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        defaultValue: randomString({ len: 128, uppercase: true, numbers: true, special: true })
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // A token to help facilitate changing passwords
      passwordResetToken: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        defaultValue: null
      },

      // When the new password will expire
      passwordResetExpire: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true
        }
      },

      emailConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      emailConfirmedToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        unique: true
      },

      emailResetToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        unique: true
      },

      // Secondary email used to reset primary email if necessary
      resetEmail: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      },

      // Whether user has accepted terms or not
      acceptedTerms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      // The number of times the user has logged in
      loginCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true
        }
      },

      // The last time the user has logged in
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        validate: {
          isDate: true
        }
      },

      // The user's primary goal
      primaryGoal: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      // The time span required to user to achieve his goals
      goalTimeline: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      // The amount required to achieve his goals
      goalAmount: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      // Finch's internal id for the user
      finchID: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      // The time span required to user to achieve his goals
      dreamHomeDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      department: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      title: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      // Date on which user left Organization (provided by finch)
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },

      // Date on which user join Organization (provided by finch)
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },

      employmentType: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      employmentSubtype: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      source: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      // Date on which user STATUS changed from ONBOARDING to ACTIVE
      joiningDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      timestamps: true, // allows sequelize to create timestamps automatically

      // A paranoid table is one that, when told to delete a record, it will not truly delete it. Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request. This means that paranoid tables perform a soft-deletion of records, instead of a hard-deletion.
      // For select (findOne, findAll etc) automatically ignore all rows when deletedAt is not null, if you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
      paranoid: true,
      freezeTableName: true, // allows sequelize to pluralize the model name
      tableName: 'Users', // define table name, must be PascalCase!
      hooks: {
        beforeValidate(user, options) {
          // remove all white space
          if (typeof user.phone === 'string') user.phone = user.phone.replace(/ /g, '');
        },

        beforeCreate(user, options) {
          // generate the salt
          user.salt = bcrypt.genSaltSync(constants.PASSWORD_LENGTH_MIN);
          user.password = bcrypt.hashSync(user.password, user.salt);
        },

        afterCreate(user, options) {
          sequelize.models.creditWallet.create({ userId: user.id, walletType: 'EMPLOYER' });
          sequelize.models.creditWallet.create({ userId: user.id, walletType: 'PLATFORM' });
        },

        beforeUpdate(user, options) {
          if (user.previous('status') != user.status)
            user.previousStatus = user.previous('status')
        }
      },
      indexes: []
    }
  );

  // association
  User.associate = models => {
    User.belongsTo(models.organization, { foreignKey: 'organizationId' });
    User.hasMany(models.plaidAccount);
    User.hasMany(models.creditWallet);
  };

  // sensitive data method
  User.getSensitiveData = () => {
    return sensitiveData;
  };

  // check if valid password
  User.validatePassword = async (password, secret) => {
    return new Promise((resolve, reject) => {
      // compare both, result is either true or false
      bcrypt.compare(password, secret, async (err, result) => {
        return err ? reject(err) : resolve(result);
      });
    });
  };

  User.createFinchEmployee = async (finchData, organizationId) => {
    User.create({
      firstName: finchData.first_name,
      lastName: finchData.last_name,
      status: 'PENDING',
      email: finchData.emails[0].data,
      roleType: 'EMPLOYEE',
      password: 'PLACEHOLDER',
      organizationId: organizationId,
      addressLine1: finchData.residence.line1,
      addressLine2: finchData.residence.line2,
      city: finchData.residence.city,
      state: finchData.residence.state,
      country: finchData.residence.country,
      zipcode: finchData.residence.postal_code,
      dateOfBirth: finchData.dob,
      finchID: finchData.id
    });
  };

  return User;
};
