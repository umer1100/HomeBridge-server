/**
 * ORGANIZATION MODEL
 *
 * Find Table Schema Here: "/database/schema.sql"
 *
 *
 * -- Organizations TABLE --
CREATE TABLE IF NOT EXISTS Organizations (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  timezone STRING NOT NULL DEFAULT 'UTC',
  locale STRING NOT NULL DEFAULT 'en',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  name STRING NOT NULL,
  email STRING NOT NULL UNIQUE,
  phone STRING DEFAULT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);
 *
 */

'use strict';

// require custom node modules

module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    'organization',
    {
      // All foreign keys are added in associations

      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'UTC'
      },

      locale: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'en'
      },

      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // The unique email of the organization
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          isEmail: true
        }
      },

      // The unique phone of the organization
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      spendLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },

      // The organization url
      url: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

      // The finch (HRIS integration) access token
      hrisAccessToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },

      // To keep track that organization by paying or guest customer
      status: {
        type: DataTypes.ENUM(['PAYING', 'GUEST']),
        allowNull: false,
        defaultValue: 'GUEST'
      }
    },
    {
      timestamps: true, // allows sequelize to create timestamps automatically

      // A paranoid table is one that, when told to delete a record, it will not truly delete it. Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request. This means that paranoid tables perform a soft-deletion of records, instead of a hard-deletion.
      // For select (findOne, findAll etc) automatically ignore all rows when deletedAt is not null, if you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
      paranoid: true,
      freezeTableName: true, // allows sequelize to pluralize the model name
      tableName: 'Organizations', // define table name, must be PascalCase!
      hooks: {
        afterCreate(organization, options) {
          sequelize.models.program.create({ organizationId: organization.id });
        }
      },
      indexes: []
    }
  );

  // association
  Organization.associate = models => {
    Organization.hasMany(models.user);
    Organization.hasOne(models.program);
  };

  return Organization;
};
