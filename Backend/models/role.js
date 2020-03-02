'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: DataTypes.STRING,
    can_create_room: DataTypes.BOOLEAN
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
    Role.hasMany(models.User, {foreignKey: 'role', as: 'users'})
  };
  return Role;
};
