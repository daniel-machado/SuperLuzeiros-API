'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("specialty", {
      id: { 
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      category: {
        type: Sequelize.ENUM("manuais", "agricolas", "missionarias", "profissionais", "recreativas", "saude", "natureza", "domesticas", "adra", "mestrado"),
        allowNull: false,
      },
      codeSpe: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      numberSpe: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      levelSpe: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      yearSpe: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      emblem: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      requirements: { 
        type: Sequelize.JSON, 
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
    await queryInterface.dropTable('specialty');
  }
};
