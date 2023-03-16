/**
 * PlaidAccount Fixture Data
 */

'use strict';

module.exports = [
  {
    id: 1,
    accountId: '1234',
    name: 'Citibank',
    itemId: '99995555',
    mask: '5555',
    type: 'depository',
    subtype: 'checking',
    custUrl: '',
    fundingSourceUrl: '',
    userId: 1,
    accessToken: 'accessToken',
    processorToken: 'processorToken',
    institutionName: 'Citibank',
    primaryAccount: true
  },
  {
    id: 2,
    accountId: '1234',
    name: 'Citibank',
    itemId: '99995555',
    mask: '5555',
    type: 'depository',
    subtype: 'savings',
    custUrl: '',
    fundingSourceUrl: '',
    userId: 1,
    accessToken: 'accessToken',
    processorToken: 'processorToken',
    institutionName: 'Citibank',
    primaryAccount: false
  }
];
