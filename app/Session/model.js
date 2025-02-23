/**
 * SESSION MODEL
 *
 * Find Table Schema Here: "/database/schema.sql"
 *
 *  -- SESSION TABLE --
 *   id INT PRIMARY KEY NOT NULL AUTO INCREMENT,
 *
 *   userId INT DEFAULT NULL REFERENCES Users(id),
 *   JWT STRING NOT NULL
 *
 *  -- Autogenerated by Sequelize
 * createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
 * updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc');
 */

'use strict';

// require custom node modules
const constants = require('../../helpers/constants');

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sessionableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sessionableType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jwt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expirationAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    timestamps: true, // allows sequelize to create timestamps automatically

    // A paranoid table is one that, when told to delete a record, it will not truly delete it. Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request. This means that paranoid tables perform a soft-deletion of records, instead of a hard-deletion.
    // For select (findOne, findAll etc) automatically ignore all rows when deletedAt is not null, if you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
    paranoid: false,
    freezeTableName: true, // allows sequelize to pluralize the model name
    tableName: 'Sessions', // define table name, must be PascalCase!
    hooks: {},
    indexes: []
  });

  Session.associate = models => {
    Session.belongsTo(models.user, { foreignKey: 'sessionableId', constraints: false })
    Session.belongsTo(models.admin, { foreignKey: 'sessionableId', constraints: false })
  }

  return Session;
}
