'use strict';

const replaceEnum = require('sequelize-replace-enum-postgres').default;

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      return await replaceEnum({
        queryInterface,
        tableName: 'EmployeeSyncs',
        columnName: 'status',
        newValues: ['PENDING', 'RUNNING', 'FINISHED', 'CANCELLED', 'SCHEDULED'],
        enumName: 'enum_EmployeeSyncs_status'
      });
    } catch (err) {
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      return await replaceEnum({
        queryInterface,
        tableName: 'EmployeeSyncs',
        columnName: 'status',
        newValues: ['RUNNING', 'FINISHED', 'CANCELLED', 'SCHEDULED'],
        enumName: 'enum_EmployeeSyncs_status'
      });
    } catch (err) {
      throw err;
    }
  }
};
