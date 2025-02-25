'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('individual_evaluation', 'dbvId', 'userId');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('individual_evaluation', 'userId', 'dbvId');
  }
};
