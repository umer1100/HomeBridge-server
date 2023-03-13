'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Programs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },

      organizationId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'Organizations'
          },
          key: 'id'
        }
      },

      isProgramActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      signupBonusValue: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
      },

      signupBonusActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      defaultContribution: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
      },

      // When program was created
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        validate: {
          isDate: true
        }
      },

      // When program was updated
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        validate: {
          isDate: true
        }
      },

      // When program was deleted
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
        validate: {
          isDate: true
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Programs');
  }
};
