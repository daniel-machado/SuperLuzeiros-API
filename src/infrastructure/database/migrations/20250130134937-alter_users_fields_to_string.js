'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.changeColumn('users', 'verificationCodeValidation', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'forgotPasswordCodeValidation', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.changeColumn('users', 'verificationCodeValidation', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'forgotPasswordCodeValidation', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  }
};
