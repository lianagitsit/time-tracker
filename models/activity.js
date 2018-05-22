'use strict';
module.exports = (sequelize, DataTypes) => {
  var Activity = sequelize.define('Activity', {
    name: DataTypes.STRING,
    time: DataTypes.INTEGER
  }, {});
  Activity.associate = function(models) {
    // associations can be defined here
    Activity.belongsTo(models.User, {
      foreignKey: {
          allowNull: false
      }
    });
  };
  return Activity;
};