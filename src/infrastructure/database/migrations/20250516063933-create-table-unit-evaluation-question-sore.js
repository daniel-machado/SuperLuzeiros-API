'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize; 
    await queryInterface.createTable("unit_evaluation_question_scores", {
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        unitEvaluationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        questionId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        score: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('unit_evaluation_question_scores');
  }
};
