'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Covids', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      dob: {
        allowNull: true,
        type: Sequelize.DATE
      },
      cnic: {
        type: Sequelize.STRING
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING
      },
      travel_history: {
        allowNull: true,
        type: Sequelize.STRING
      },
      cough: {
        type: Sequelize.STRING
      },
      cough_started: {
        allowNull: true,
        type: Sequelize.DATE
      },
      sore_throat: {
        type: Sequelize.STRING
      },
      sore_throat_started: {
        allowNull: true,
        type: Sequelize.DATE
      },
      fever: {
        type: Sequelize.STRING
      },
      fever_started: {
        allowNull: true,
        type: Sequelize.DATE
      },
      breath_shortness: {
        type: Sequelize.STRING
      },
      breath_shortness_started: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Covids');
  }
};
