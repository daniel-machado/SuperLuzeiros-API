'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('individual_evaluation', 'counselorId', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.changeColumn('individual_evaluation', 'evaluationDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('individual_evaluation', 'counselorId', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.changeColumn('individual_evaluation', 'evaluationDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};
