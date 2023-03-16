'use strict';

const replaceEnum = require('sequelize-replace-enum-postgres').default;

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return await replaceEnum({
        queryInterface,
        tableName: 'Users',
        columnName: 'status',
        defaultValue: 'NEW',
        newValues: ['PENDING', 'ACTIVE', 'INACTIVE', 'ONBOARDING', 'NEW', 'PAUSE'],
        enumName: 'enum_Users_status'
      });
    } catch (err) {
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      return await replaceEnum({
        queryInterface,
        tableName: 'Users',
        columnName: 'status',
        defaultValue: 'PENDING',
        newValues: ['PENDING', 'ACTIVE', 'INACTIVE', 'ONBOARDING'],
        enumName: 'enum_Users_status'
      });
    } catch (err) {
      throw err;
    }
  }
};
