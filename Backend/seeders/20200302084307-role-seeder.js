'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
        title: 'Admin',
        can_create_room: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'User',
        can_create_room: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Attendee',
        can_create_room: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
