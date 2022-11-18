'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Users',
        'primaryGoal',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
          defaultValue: null
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Users',
        'goalTimeline',
        {
          type: Sequelize.DataTypes.STRING,
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
      await queryInterface.removeColumn('Users', 'primaryGoal', { transaction });
      await queryInterface.removeColumn('Users', 'goalTimeline', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
