'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn('users', 'facebook', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'linkedin', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'instagram', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'youtube', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'biografia', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'facebook');
    await queryInterface.removeColumn('users', 'linkedin');
    await queryInterface.removeColumn('users', 'instagram');
    await queryInterface.removeColumn('users', 'youtube');
    await queryInterface.removeColumn('users', 'biografia');
  }
};
