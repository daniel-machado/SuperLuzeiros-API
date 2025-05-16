'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn('unit_evaluation_question_scores', 'createdAt', {
     type: DataTypes.DATE,
         allowNull: false,
         defaultValue: new Date(),
    });
    await queryInterface.addColumn('unit_evaluation_question_scores', 'updatedAt', {
     type: DataTypes.DATE,
         allowNull: false,
         defaultValue: new Date(),
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('unit_evaluation_question_scores', 'createdAt');
    await queryInterface.removeColumn('unit_evaluation_question_scores', 'updatedAt');
  }
};