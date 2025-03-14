'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('class', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('regular', 'advanced', 'leadership'),
        allowNull: false,
      },
      emblem: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      minAge: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      maxAge: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      requirements: { 
        type: Sequelize.JSONB, 
        allowNull: true, 
        defaultValue: []
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
    await queryInterface.dropTable('class');
  }
};
