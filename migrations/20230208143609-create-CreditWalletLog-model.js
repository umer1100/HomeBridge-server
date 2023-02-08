'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CreditWalletLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      creditWalletId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },

      ownerificDollars: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          isDecimal: true
        },
        get() {
          // convert string to float
          const rawValue = this.getDataValue(ownerificDollars);
          return Number(rawValue);
        }
      },

      description: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: null
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CreditWalletLogs');
  }
};
