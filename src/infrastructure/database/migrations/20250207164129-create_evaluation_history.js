'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('evaluation_history', {
      id: { 
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      evaluationType: { 
        type: Sequelize.ENUM('unit', 'individual'), 
        allowNull: false 
      },
      evaluationId: { 
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'unit_evaluation',
          key: 'id',
        }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data: { 
        type: Sequelize.JSON, 
        allowNull: false 
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('evaluation_history');
  }
};
