/**
 * USER ACTION
 *
 * Aggregates all action method files to be exported here
 * !NOTE: This file is updated automatically using the feature gen/del commands and is sorted alphabetically
 */

'use strict';

module.exports = {
  ...require('./V1CreateByAdmin'),
  ...require('./V1CreateByOrganizationalUser'),
  ...require('./V1CreateGuest'),
  ...require('./V1Login'),
  ...require('./V1ConfirmEmail'),
  ...require('./V1ReadByUser'),
  ...require('./V1ReadByAdmin'),
  ...require('./V1SendResetPasswordToken'),
  ...require('./V1ResetPassword'),
  ...require('./V1Update'),
  ...require('./V1UpdatePassword'),
  ...require('./V1UpdateBulkUsers')
};
