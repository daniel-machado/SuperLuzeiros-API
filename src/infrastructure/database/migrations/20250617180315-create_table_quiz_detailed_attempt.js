'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quiz_user_detailed_attempt', {
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
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quizId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'quiz',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      attemptId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'quiz_user_attempt',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalQuestions: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'failed'),
        allowNull: false,
      },
      attemptDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      userAnswers: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      quizDetails: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      summary: {
        type: Sequelize.JSONB,
        allowNull: true,
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

    await queryInterface.addIndex('quiz_user_detailed_attempt', ['userId']);
    await queryInterface.addIndex('quiz_user_detailed_attempt', ['quizId']);
    await queryInterface.addIndex('quiz_user_detailed_attempt', ['attemptId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quiz_user_detailed_attempt');
  },
};
