'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sessionableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sessionableType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jwt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expirationAt: {
        type: Sequelize.DATE,
        allowNull: false,
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

  down: (queryInterface) => {
    return queryInterface.dropTable('Sessions');
  }
};
