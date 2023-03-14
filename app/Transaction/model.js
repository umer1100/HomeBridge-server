/**
 * TRANSACTION MODEL
 *
 * Find Table Schema Here: "/database/schema.sql"
 *
 *
 * CREATE TYPE CONTRIBUTIONTYPE AS ENUM ('DEFAULT', 'MATCHED', 'SPOT_BONUS', 'SIGNUP_BONUS', 'MILESTONE_BONUS');
 * CREATE TYPE TRANSACTIONTYPE AS ENUM ('DEPOSIT', 'WITHDRAWAL');
 *
 * CREATE TABLE IF NOT EXISTS Transactions (
 * id BIGSERIAL PRIMARY KEY NOT NULL,
 *
 * sourcedAccount BIGINT NOT NULL REFERENCES PlaidAccount(id),
 * fundedAccount BIGINT NOT NULL REFERENCES PlaidAccount(id),
 *
 * amount REAL NOT NULL,
 * contributionType CONTRIBUTIONTYPE NOT NULL,
 * transactionType TRANSACTIONTYPE NOT NULL,
 * transferUrl TEXT DEFAULT NULL,
 *
 * createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
 * updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
 *
 */

'use strict';

// require custom node modules
const constants = require('../../helpers/constants');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'transaction',
    {
      // All foreign keys are added in associations

      amount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false
      },

      contributionType: {
        type: DataTypes.ENUM(['DEFAULT', 'MATCHED', 'SPOT_BONUS', 'SIGNUP_BONUS', 'MILESTONE_BONUS']),
        allowNull: false
      },

      transferUrl: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      timestamps: true, // allows sequelize to create timestamps automatically

      // A paranoid table is one that, when told to delete a record, it will not truly delete it. Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request. This means that paranoid tables perform a soft-deletion of records, instead of a hard-deletion.
      // For select (findOne, findAll etc) automatically ignore all rows when deletedAt is not null, if you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
      paranoid: true,
      freezeTableName: true, // allows sequelize to pluralize the model name
      tableName: 'Transactions', // define table name, must be PascalCase!
      hooks: {},
      indexes: []
    }
  );

  // association
  Transaction.associate = models => {
    Transaction.belongsTo(models.plaidAccount, { as: 'fundedAccount', foreignKey: 'fundedAccountId' });
    Transaction.belongsTo(models.plaidAccount, { as: 'sourceAccount', foreignKey: 'sourcedAccountId' });
  };

  return Transaction;
};
