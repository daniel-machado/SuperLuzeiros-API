'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("quiz_statistics", {
      id: { 
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: { 
        type: Sequelize.UUID,
        allowNull: false,
        references: { 
          model: 'users', 
          key: 'id' 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      quizId: { 
        type: Sequelize.UUID,
        allowNull: false,
        references: { 
          model: 'quiz', 
          key: 'id' 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      bestScore: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      averageScore: {
        type: Sequelize.FLOAT,
        defaultValue: 0
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
    await queryInterface.dropTable('quiz_statistics');
  }
};
