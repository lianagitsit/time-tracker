'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Activity, {
      onDelete: "cascade"
    });
  };
  return User;
};