'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize; 
    await queryInterface.createTable('daily_verse_readings', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      book: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chapter: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pointsEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

    await queryInterface.addConstraint('daily_verse_readings', {
      fields: ['userId', 'date'],
      type: 'unique',
      name: 'unique_user_date_reading'
    });
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('daily_verse_readings');
  }
};
