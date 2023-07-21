'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'Users',
      {
        status: 'ACTIVE',
      },
      {
        roleType: 'EMPLOYEE',
        status: 'ONBOARDING',
      }
    );
  },
};
