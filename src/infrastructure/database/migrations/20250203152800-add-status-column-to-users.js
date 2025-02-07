'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  async down (queryInterface, Sequelize) {
    // Remover a coluna e os valores ENUM ao reverter a migration
    await queryInterface.removeColumn('users', 'status');
    await queryInterface.sequelize.query('DROP TYPE "enum_users_status";'); 
  }
};
