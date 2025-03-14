'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('quiz_user_attempt', 'failedQuizzes', {
      type: Sequelize.INTEGER,
      defaultValue: 0, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('quiz_user_attempt', 'failedQuizzes');
  }
};
