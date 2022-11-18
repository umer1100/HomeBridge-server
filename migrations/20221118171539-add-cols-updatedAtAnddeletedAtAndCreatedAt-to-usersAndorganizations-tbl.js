'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Organizations',
        'createdAt',
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
          validate: {
            isDate: true
          }
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Organizations',
        'updatedAt',
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
          validate: {
            isDate: true
          }
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Organizations',
        'deletedAt',
        {
          type: Sequelize.DATE,
          defaultValue: null,
          validate: {
            isDate: true
          }
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'Users',
        'createdAt',
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
          validate: {
            isDate: true
          }
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Users',
        'updatedAt',
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
          validate: {
            isDate: true
          }
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Users',
        'deletedAt',
        {
          type: Sequelize.DATE,
          defaultValue: null,
          validate: {
            isDate: true
          }
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
      await queryInterface.removeColumn('Users', 'createdAt', { transaction });
      await queryInterface.removeColumn('Users', 'deletedAt', { transaction });
      await queryInterface.removeColumn('Users', 'updatedAt', { transaction });
      await queryInterface.removeColumn('Organizations', 'createdAt', { transaction });
      await queryInterface.removeColumn('Organizations', 'deletedAt', { transaction });
      await queryInterface.removeColumn('Organizations', 'updatedAt', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
