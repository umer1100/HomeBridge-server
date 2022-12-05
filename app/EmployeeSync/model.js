/**
 * EMPLOYEESYNC MODEL
 *
 * Find Table Schema Here: "/database/schema.sql"
 * 
 * 
 * -- HRIS Sync TABLE --
 * CREATE TABLE IF NOT EXISTS EmployeeSync (
 *  id BIGSERIAL PRIMARY KEY NOT NULL,
 *
 *  organizationId BIGINT DEFAULT NULL REFERENCES Organizations(id),
 *
 *  startedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
 *  finishedAt TIMESTAMP WITHOUT TIME ZONE,
 *  status TEXT NOT NULL, -- RUNNING, FAILED, SUCCEEDED
 *  description JSON DEFAULT NULL,
 *
);
 */

'use strict';

// require custom node modules
const constants = require('../../helpers/constants');

module.exports = (sequelize, DataTypes) => {
  const EmployeeSync = sequelize.define(
    'employeeSync',
    {
      // All foreign keys are added in associations

      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // now
        validate: {
          isDate: true
        }
      },

      finishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true
        }
      },

      status: {
        type: DataTypes.ENUM(['RUNNING', 'FINISHED', 'CANCELLED', 'SCHEDULED']),
        allowNull: false
      },

      description: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null
      },

      succeeded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      timestamps: true, // allows sequelize to create timestamps automatically

      // A paranoid table is one that, when told to delete a record, it will not truly delete it. Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request. This means that paranoid tables perform a soft-deletion of records, instead of a hard-deletion.
      // For select (findOne, findAll etc) automatically ignore all rows when deletedAt is not null, if you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
      paranoid: true,
      freezeTableName: true, // allows sequelize to pluralize the model name
      tableName: 'EmployeeSyncs', // define table name, must be PascalCase!
      hooks: {},
      indexes: []
    }
  );

  // association
  EmployeeSync.associate = models => {
    EmployeeSync.belongsTo(models.organization, { foreignKey: 'organizationId' });
  };

  return EmployeeSync;
};
