/**
 * ACCOUNT ACTION
 *
 * Aggregates all action method files to be exported here
 * !NOTE: This file is updated automatically using the feature gen/del commands and is sorted alphabetically
 */

'use strict';

module.exports = {
  ...require('./V1CreateLinkToken'),
  ...require('./V1CreateAccessToken'),
  ...require('./V1GetAccountsDetails'),
  ...require('./V1UnlinkAccounts')  
}
