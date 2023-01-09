'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlaidAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },

      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        allowNull: false
      },

      itemId: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false
      },

      accountId: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      accessToken: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false
      },

      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      mask: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      processorToken: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      custUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      fundingSourceUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      type: {
        type: Sequelize.TEXT,
        defaultValue: null
      },

      subtype: {
        type: Sequelize.TEXT,
        defaultValue: null
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PlaidAccounts');
  }
};
