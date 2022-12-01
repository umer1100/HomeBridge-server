/**
 * USER HELPER
 */

'use strict';

module.exports = {
  isEmployer
}

/**
 * Return true if roleType is Employer
 *
 * @roleType (USER OBJECT): the user roleType
 *
 */
 function isEmployer(roleType) {
  return roleType == 'EMPLOYER'
}