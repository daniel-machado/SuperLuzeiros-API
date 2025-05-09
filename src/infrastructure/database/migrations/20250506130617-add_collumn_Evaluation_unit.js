'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize; 
    await queryInterface.addColumn('unit_evaluation_questions', 'typeQuestion', {
      type: DataTypes.ENUM('text', 'number', 'yes_no'),
      allowNull: false,
      defaultValue: 'text'
    });
    await queryInterface.addColumn('unit_evaluation_questions', 'description', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('unit_evaluation_questions', 'typeQuestion');
    await queryInterface.removeColumn('unit_evaluation_questions', 'description');
  }
};
