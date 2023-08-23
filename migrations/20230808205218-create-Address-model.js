'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },

      addressableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      addressableType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      addressLine1: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      addressLine2: {
        type: Sequelize.TEXT,
        defaultValue: '',
        allowNull: false
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

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Addresses');
  }
};