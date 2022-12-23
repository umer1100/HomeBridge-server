'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Users',
        'department',
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Users',
        'title',
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Users',
        'endDate',
        {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Users',
        'startDate',
        {
          type: Sequelize.DATE,
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

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Users', 'department', { transaction });
      await queryInterface.removeColumn('Users', 'title', { transaction });
      await queryInterface.removeColumn('Users', 'endDate', { transaction });
      await queryInterface.removeColumn('Users', 'startDate', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
