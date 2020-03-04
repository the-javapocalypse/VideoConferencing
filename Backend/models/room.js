'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: DataTypes.STRING,
    digest: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {});
  Room.associate = function(models) {
    // associations can be defined here
    Room.belongsToMany(models.User, {through: 'User_Room', foreignKey: 'room_id', as: 'meeting'})
  };
  return Room;
};
