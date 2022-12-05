'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeSyncs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },

      organizationId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'Organizations'
          },
          key: 'id'
        },
        allowNull: false
      },

      startedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // now
        validate: {
          isDate: true
        }
      },

      finishedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isDate: true
        }
      },

      status: {
        type: Sequelize.ENUM(['RUNNING', 'FINISHED', 'CANCELLED', 'SCHEDULED']),
        allowNull: false
      },

      description: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: null
      },

      succeeded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EmployeeSyncs');
  }
};
