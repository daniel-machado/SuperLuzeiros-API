'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('unit_counselors', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,     
      },
      unitId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'units',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addConstraint('unit_counselors', {
      fields: ['userId'],
      type: 'unique',
      name: 'unique_counselor_per_unit',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('unit_counselors');
  }
};
