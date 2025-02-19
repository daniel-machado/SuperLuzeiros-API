'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("unit_ranking", "correctAnswers", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }).then(() => {
      return queryInterface.addColumn("unit_ranking", "wrongAnswers", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("unit_ranking", "correctAnswers")
      .then(() => {
        return queryInterface.removeColumn("unit_ranking", "wrongAnswers");
      });
  }
};
