'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CreditWallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      userId: {
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
          const rawValue = this.getDataValue(example3);
          return Number(rawValue);
        }
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
    await queryInterface.dropTable('CreditWallets');
  }
};
