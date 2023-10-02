/**
 * QUESTIONAIRE MODEL
 *
 * Find Table Schema Here: "/database/schema.sql"
 */

'use strict';

// require custom node modules
const constants = require('../../helpers/constants');

module.exports = (sequelize, DataTypes) => {
  const Questionaire = sequelize.define('questionaire', {
    // All foreign keys are added in associations
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    nearestState: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },

    homeBudget: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },

    profile: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },

    isWorkingWithAgent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    preApprovedLoan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    desiredBedrooms: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },

    timelineGoal: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
  }, {
    timestamps: true, // allows sequelize to create timestamps automatically

    // A paranoid table is one that, when told to delete a record, it will not truly delete it. Instead, a special column called deletedAt will have its value set to the timestamp of that deletion request. This means that paranoid tables perform a soft-deletion of records, instead of a hard-deletion.
    // For select (findOne, findAll etc) automatically ignore all rows when deletedAt is not null, if you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
    paranoid: true,
    freezeTableName: true, // allows sequelize to pluralize the model name
    tableName: 'Questionaires', // define table name, must be PascalCase!
    hooks: {},
    indexes: []
  });

  Questionaire.associate = models => {
    Questionaire.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return Questionaire;
}
