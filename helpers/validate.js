/**
 * All validating data helpers
 *
 * TODO: Test
 */

'use strict';

// moment
const moment = require('moment-timezone');

// constants
const { ROLE, ROLES } = require('./constants');

module.exports = {
  isValidTimezone,
  isValidRoleAction
};

/**
 * Takes in a timezone name and checks if it's valid
 *
 * @timezone - (STRING - REQUIRED): the timezone name to check
 *
 * return true or false
 */
function isValidTimezone(timezone) {
  // get all timezone names in an array
  const tzNames = moment.tz.names();
  return tzNames.indexOf(timezone) >= true;
}

/**
 * Takes in two roles and determines if the first can act upon the other.
 *
 * @activeRole - (STRING - REQUIRED): the role that is acting upon the passive role
 * @passiveRole - (STRING - REQUIRED): the role that is being acted upon
 *
 * return true or false
 */
function isValidRoleAction(activeRole, passiveRole) {
  if (ROLES.indexOf(activeRole) < ROLES.indexOf(passiveRole)) return true;

  return false;
}
