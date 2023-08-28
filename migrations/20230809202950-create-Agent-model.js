'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Agents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      middleName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },

      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      officeName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // The unique email of the Agent
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },

      // The phone of the Agent
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },

      reviewsURL: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },

      // The organization url
      applicationURL: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },

      // The image of the agent
      imageURL: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Agents');
  }
};