'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize
    await queryInterface.changeColumn('daily_verse_readings', 'userId', {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: { 
        model: 'users', 
        key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize
    await queryInterface.changeColumn('daily_verse_readings', 'userId', {
      type: DataTypes.UUID,
      allowNull: false,
    });
  }
};
