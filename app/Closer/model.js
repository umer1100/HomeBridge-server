/**
 * CLOSER MODEL
 *
 * Find Table Schema Here: "/database/schema.sql"
 *
 *
 * CREATE TABLE IF NOT EXISTS Closers (
 * id BIGSERIAL PRIMARY KEY NOT NULL,
 *
 * firstName STRING NOT NULL,
 * middleName STRING DEFAULT NULL,
 * lastName STRING NOT NULL,
 * email STRING NOT NULL UNIQUE,
 * phone STRING DEFAULT NULL,
 * website TEXT DEFAULT NUll,
 * officeName TEXT DEFAULT NULL,
 *
 * reviewsURL TEXT DEFAULT NULL,
 * applicationURL TEXT DEFAULT NULL,
 * imageURL TEXT DEFAULT NULL,
 *
 * -- Autogenerated by Sequelize
 * deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
 * createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
 * updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
 *
 *
 *
 */

'use strict';

// require custom node modules
const constants = require('../../helpers/constants');

module.exports = (sequelize, DataTypes) => {
  const Closer = sequelize.define('closer', {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // All foreign keys are added in associations

    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    officeName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // The unique email of the Closer
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },

    // The phone of the Closer
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },

    reviewsURL: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    // The organization url
    applicationURL: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    // The image of the closer
    imageURL: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
  }, {
    timestamps: true, // allows sequelize to create timestamps automatically

    // A paranoid table is one that, when told to delete a record, it will not truly delete it. Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request. This means that paranoid tables perform a soft-deletion of records, instead of a hard-deletion.
    // For select (findOne, findAll etc) automatically ignore all rows when deletedAt is not null, if you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
    paranoid: true,
    freezeTableName: true, // allows sequelize to pluralize the model name
    tableName: 'Closers', // define table name, must be PascalCase!
    hooks: {},
    indexes: []
  });

  // association
  Closer.associate = models => {
    Closer.hasMany(models.address, {
      foreignKey: 'addressableId',
      constraints: false,
      scope: {
        addressableType: 'closer'
      }
    })
  };

  return Closer;
}
