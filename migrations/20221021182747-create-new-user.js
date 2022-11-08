'use strict';
const { randomString } = require('../helpers/logic');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },

      organizationId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'Organizations'
          },
          key: 'id'
        },
        allowNull: true
      },

      timezone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'UTC'
      },

      locale: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'en'
      },

      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
          isDecimal: true
        }
      },

      sex: {
        type: Sequelize.ENUM(['MALE', 'FEMALE', 'OTHER']),
        allowNull: true
      },

      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      middleName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },

      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // The unique email of the user
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },

      // The unique phone of the user
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },

      // The role of the user
      role: {
        type: Sequelize.ENUM(['EMPLOYER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'GUEST']),
        allowNull: false
      },

      // The KYC id type, can be either social security number or passport
      kycIdType: {
        type: Sequelize.ENUM(['SSN', 'PASSPORT']),
        allowNull: true
      },

      // The KYC id number
      kycIdNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },

      addressLine1: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      addressLine2: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      city: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      state: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      country: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      zipcode: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true
      },

      // salt should be randomly generate
      salt: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        defaultValue: randomString({ len: 128, uppercase: true, numbers: true, special: true })
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // A token to help facilitate changing passwords
      passwordResetToken: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        defaultValue: null
      },

      // When the new password will expire
      passwordResetExpire: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        validate: {
          isDate: true
        }
      },

      emailConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
      },

      emailConfirmedToken: {
        type: Sequelize.TEXT,
        allowNull: true,
        default: null,
        unique: true
      },

      emailResetToken: {
        type: Sequelize.TEXT,
        allowNull: true,
        default: null,
        unique: true
      },

      // Secondary email used to reset primary email if necessary
      resetEmail: {
        type: Sequelize.TEXT,
        allowNull: true,
        default: null
      },

      // Whether user has accepted terms or not
      acceptedTerms: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      // The number of times the user has logged in
      loginCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true
        }
      },

      // The last time the user has logged in
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        validate: {
          isDate: true
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
