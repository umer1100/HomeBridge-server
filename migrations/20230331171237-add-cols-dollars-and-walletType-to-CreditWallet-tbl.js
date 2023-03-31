'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn(
        'CreditWallets',
        'ownerificDollars',
        'dollars',
        { transaction }
      );

      await queryInterface.addColumn(
        'CreditWallets',
        'walletType',
        {
          type: Sequelize.ENUM(['PLATFORM', 'EMPLOYER']),
          allowNull: false,
          defaultValue: 'PLATFORM'
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('CreditWallets', 'walletType', { transaction });
      await queryInterface.renameColumn('CreditWallets', 'dollars', 'ownerificDollars', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
