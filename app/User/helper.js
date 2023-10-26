/**
 * USER HELPER
 */

'use strict';

const { ROLE } = require("../../helpers/constants");

module.exports = {
  isEmployer,
  isEmployee
};

/**
 * Return true if roleType is Employer
 *
 * @roleType (USER OBJECT): the user roleType
 *
 */
function isEmployer(user) {
  const { roleType } = user;
  return roleType == ROLE.EMPLOYER;
}

function isEmployee(user) {
  const { roleType } = user;
  return roleType === ROLE.EMPLOYEE;
}
