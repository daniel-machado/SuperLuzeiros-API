'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("quiz_user_attempt", {
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
      score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: { 
        type: Sequelize.ENUM('pending', 'approved', 'failed'),
        allowNull: false, 
        defaultValue: 'pending' 
      },
      attemptDate: { 
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      failedAttempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      lastAttempt: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('quiz_user_attempt');
  }
};
