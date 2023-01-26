'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },

      sourcedAccountId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'PlaidAccounts'
          },
          key: 'id'
        },
        allowNull: false
      },

      fundedAccountId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'PlaidAccounts'
          },
          key: 'id'
        },
        allowNull: false
      },

      amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false
      },

      contributionType: {
        type: Sequelize.ENUM(['DEFAULT', 'MATCHED', 'SPOT_BONUS', 'SIGNUP_BONUS', 'MILESTONE_BONUS']),
        allowNull: false
      },

      transferUrl: {
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
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};
