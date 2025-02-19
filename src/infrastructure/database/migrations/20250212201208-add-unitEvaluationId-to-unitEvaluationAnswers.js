'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('unit_evaluation_answers', 'unitEvaluationId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'unit_evaluation',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('unit_evaluation_answers', 'unitEvaluationId');
  }
};
