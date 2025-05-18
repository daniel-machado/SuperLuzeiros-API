'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize
    await queryInterface.changeColumn('daily_verse_readings', 'date', {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('date');
        return rawValue ? new Date(rawValue + 'T00:00:00') : null;
      }
    });
    await queryInterface.changeColumn('daily_verse_readings', 'readAt', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      get() {
        const rawValue = this.getDataValue('readAt');
        return rawValue ? new Date(rawValue) : null;
      }
    });
  },

  async down (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize
    await queryInterface.changeColumn('daily_verse_readings', 'date', {
      type: DataTypes.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('daily_verse_readings', 'readAt', {
      type: DataTypes.DATE,
      allowNull: false,
    });
  }
};
