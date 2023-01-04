'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Users',
        'employmentType',
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Users',
        'employmentSubtype',
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

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Users', 'employmentType', { transaction });
      await queryInterface.removeColumn('Users', 'employmentSubtype', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
