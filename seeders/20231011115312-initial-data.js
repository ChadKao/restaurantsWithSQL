'use strict';
const restaurants = require('../public/jsons/restaurant.json').results
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const hash = await bcrypt.hash('12345678', 10)

      await queryInterface.bulkInsert('users', [
        {
          id: 1,
          name: 'user1',
          email: 'user1@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'user2',
          email: 'user2@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction })

      await queryInterface.bulkInsert('Restaurants',
        restaurants.map((restaurant, i) => {
          if (0 <= i && i <= 3) {
          return { ...restaurant, createdAt: new Date(), updatedAt: new Date(), userID: 1 }
        }
          if (4 <= i && i <= 7) {
            return { ...restaurant, createdAt: new Date(), updatedAt: new Date(), userID: 2 }
          }
        }),
        { transaction });

      await transaction.commit()
    } catch (error) {
      console.log(error);
      
      await transaction.rollback()
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null);
  }
};
