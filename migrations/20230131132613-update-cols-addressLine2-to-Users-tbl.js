'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        `UPDATE "Users" SET "addressLine2" = '' WHERE "addressLine2" is NULL`,
        { transaction }
      );

      await queryInterface.changeColumn(
        'Users',
        'addressLine2',
        {
          type: Sequelize.TEXT,
          defaultValue: '',
          allowNull: false
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn(
        'Users',
        'addressLine2',
        {
          type: Sequelize.TEXT,
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
  }
};
