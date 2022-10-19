'use strict';
const { randomString } = require('../helpers/logic');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
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
        defaultValue: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // The unique email of the employer
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },

      // The unique phone of the employer
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
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
    await queryInterface.dropTable('Employers');
  }
};
