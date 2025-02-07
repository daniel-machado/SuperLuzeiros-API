'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.addColumn('users', 'verificationCodeValidation', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'forgotPasswordCode', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'forgotPasswordCodeValidation', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'verificationCodeValidation');
    await queryInterface.removeColumn('users', 'forgotPasswordCode');
    await queryInterface.removeColumn('users', 'forgotPasswordCodeValidation');
  }
};
