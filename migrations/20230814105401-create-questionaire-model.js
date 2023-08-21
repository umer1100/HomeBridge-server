'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Questionaires', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        allowNull: false
      },
      zipcode: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      homeBudget: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      profile: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      isWorkingWithAgent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      preApprovedLoan: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      desiredBedrooms: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      timelineGoal: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('Questionaires');
  }
};
