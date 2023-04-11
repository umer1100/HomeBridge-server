'use strict';
const models = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_CreditWallets_walletType";')
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

      let users = await models.user.findAll({where: {roleType: 'EMPLOYEE'}, attributes: ['id'], raw: true });
      const employerWallets = users.map(({ id }) => ({
          userId: id,
          dollars: 0,
          walletType: 'EMPLOYER',
      }));

      await models.creditWallet.bulkCreate(employerWallets);

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
