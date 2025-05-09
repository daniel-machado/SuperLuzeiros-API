'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('individual_ranking', 'totalScore', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('individual_ranking', 'totalScore', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  }
};
