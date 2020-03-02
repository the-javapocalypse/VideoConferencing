'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Role, {foreignKey: 'role', as: 'role'})
    User.belongsToMany(models.Room, {through: 'User_Room', foreignKey: 'user_id', as: 'attendees'})
  };
  return User;
};
