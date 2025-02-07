'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("unit_dbvs", {
      fields: ["unitId", "userId"],
      type: "unique",
      name: "unique_unit_dbv", // Nome da constraint
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("unit_dbvs", "unique_unit_dbv");
  }
};
