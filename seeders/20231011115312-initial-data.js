'use strict';
const restaurants = require('../public/jsons/restaurant.json').results

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Restaurants',
      restaurants.map(restaurant => ({ ...restaurant, createdAt: new Date(), updatedAt: new Date() })));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null); 
  }
};
