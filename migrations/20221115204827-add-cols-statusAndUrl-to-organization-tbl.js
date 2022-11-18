'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Organizations',
        'url',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Organizations',
        'status',
        {
          type: Sequelize.ENUM(['PAYING', 'GUEST']),
          allowNull: false,
          defaultValue: 'GUEST'
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
      await queryInterface.removeColumn('Organizations', 'url', { transaction });
      await queryInterface.removeColumn('Organizations', 'status', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
