'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn('daily_verse_readings', 'streak', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('daily_verse_readings', 'life', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('daily_verse_readings', 'streak');
    await queryInterface.removeColumn('daily_verse_readings', 'life');
  }
};
