/**
 * CLOSER ACTION
 *
 * Aggregates all action method files to be exported here
 * !NOTE: This file is updated automatically using the feature gen/del commands and is sorted alphabetically
 */

'use strict';

const { required } = require('@hapi/joi');

module.exports = {
  ...require('./V1Create'),
  ...require('./V1Query')
}
