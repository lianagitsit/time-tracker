'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    googleId: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Activity, {
      onDelete: "cascade"
    });
  };
  return User;
};