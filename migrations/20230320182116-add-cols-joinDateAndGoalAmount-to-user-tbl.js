'use strict';
const models = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Users',
        'joiningDate',
        {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        },
        { transaction }
      );

      // adding a default joined date for already ACTIVE and PAUSE users
      await models.user.update(
        { joiningDate: new Date() },
        { where: { status: ['ACTIVE', 'PAUSE'], joiningDate: null },
          transaction
        }
      );

      await queryInterface.addColumn(
        'Users',
        'goalAmount',
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, _Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Users', 'joiningDate', { transaction });
      await queryInterface.removeColumn('Users', 'goalAmount', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};