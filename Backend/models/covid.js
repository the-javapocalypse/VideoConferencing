'use strict';
module.exports = (sequelize, DataTypes) => {
  const Covid = sequelize.define('Covid', {
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.DATE,
    cnic: DataTypes.STRING,
    address: DataTypes.STRING,
    mobile: DataTypes.STRING,
    phone: DataTypes.STRING,
    travel_history: DataTypes.STRING,
    cough: DataTypes.STRING,
    cough_started: DataTypes.DATE,
    sore_throat: DataTypes.STRING,
    sore_throat_started: DataTypes.DATE,
    fever: DataTypes.STRING,
    fever_started: DataTypes.DATE,
    breath_shortness: DataTypes.STRING,
    breath_shortness_started: DataTypes.DATE
  }, {});
  Covid.associate = function(models) {
    // associations can be defined here
  };
  return Covid;
};