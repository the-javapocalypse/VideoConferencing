'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Room = sequelize.define('User_Room', {
    user_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER
  }, {});
  User_Room.associate = function(models) {
    // associations can be defined here
    User_Room.belongsTo(models.User, {foreignKey: 'user_id'})
    User_Room.belongsTo(models.Room, {foreignKey: 'room_id'})
  };
  return User_Room;
};
