'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize
    await queryInterface.changeColumn('daily_verse_readings', 'date', {
      type: DataTypes.DATE,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize
    await queryInterface.changeColumn('daily_verse_readings', 'date', {
      type: DataTypes.DATEONLY,
      allowNull: false,
    });
  }
};
