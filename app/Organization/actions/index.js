/**
 * ORGANIZATION ACTION
 *
 * Aggregates all action method files to be exported here
 * !NOTE: This file is updated automatically using the feature gen/del commands and is sorted alphabetically
 */

'use strict';

module.exports = {
  ...require('./V1Create'),
  ...require('./V1ReadByAdmin'),
  ...require('./V1UpdateHrisAccessToken'),
  ...require('./V1GetUsers'),
  ...require('./V1GetAverageOwnerificCredit'),
  ...require('./V1GetAverageHomePrice'),
  ...require('./V1GetTotalOwnerificCredit'),
  ...require('./V1GetCompanyDetailsFromFinch'),
  ...require('./V1GetUsersPlaidAccountDetails')
};
