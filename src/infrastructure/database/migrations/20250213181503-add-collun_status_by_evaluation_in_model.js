'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('unit_evaluation', 'status', {
      type: Sequelize.ENUM("open", "closed"), 
      defaultValue: "open"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('unit_evaluation', 'status');
  }
};
