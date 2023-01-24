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
        allowNull: false
      },

      accountId: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      accessToken: {
        type: Sequelize.TEXT,
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
        defaultValue: null
      },

      custUrl: {
        type: Sequelize.TEXT,
        defaultValue: null
      },

      fundingSourceUrl: {
        type: Sequelize.TEXT,
        defaultValue: null
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
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
        validate: {
          isDate: true
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PlaidAccounts');
  }
};
