'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    // Criar novas colunas do tipo DATE
    await queryInterface.addColumn("users", "verificationCodeValidation_temp", {
      type: DataTypes.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "forgotPasswordCodeValidation_temp", {
      type: DataTypes.DATE,
      allowNull: true,
    });

    // Copiar os valores convertidos (se necessário)
    await queryInterface.sequelize.query(`
      UPDATE "users" 
      SET "verificationCodeValidation_temp" = TO_TIMESTAMP("verificationCodeValidation")
      WHERE "verificationCodeValidation" IS NOT NULL;
    `);

    await queryInterface.sequelize.query(`
      UPDATE "users" 
      SET "forgotPasswordCodeValidation_temp" = TO_TIMESTAMP("forgotPasswordCodeValidation")
      WHERE "forgotPasswordCodeValidation" IS NOT NULL;
    `);

    // Remover as colunas antigas
    await queryInterface.removeColumn("users", "verificationCodeValidation");
    await queryInterface.removeColumn("users", "forgotPasswordCodeValidation");

    // Renomear as colunas novas para os nomes corretos
    await queryInterface.renameColumn("users", "verificationCodeValidation_temp", "verificationCodeValidation");
    await queryInterface.renameColumn("users", "forgotPasswordCodeValidation_temp", "forgotPasswordCodeValidation");
  
  },

  async down (queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    // Criar as colunas antigas como INTEGER novamente
    await queryInterface.addColumn("users", "verificationCodeValidation_temp", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "forgotPasswordCodeValidation_temp", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    // Reverter os valores convertidos (se necessário)
    await queryInterface.sequelize.query(`
      UPDATE "users" 
      SET "verificationCodeValidation_temp" = EXTRACT(EPOCH FROM "verificationCodeValidation")
      WHERE "verificationCodeValidation" IS NOT NULL;
    `);

    await queryInterface.sequelize.query(`
      UPDATE "users" 
      SET "forgotPasswordCodeValidation_temp" = EXTRACT(EPOCH FROM "forgotPasswordCodeValidation")
      WHERE "forgotPasswordCodeValidation" IS NOT NULL;
    `);

    // Remover as colunas convertidas
    await queryInterface.removeColumn("users", "verificationCodeValidation");
    await queryInterface.removeColumn("users", "forgotPasswordCodeValidation");

    // Renomear de volta para o nome original
    await queryInterface.renameColumn("users", "verificationCodeValidation_temp", "verificationCodeValidation");
    await queryInterface.renameColumn("users", "forgotPasswordCodeValidation_temp", "forgotPasswordCodeValidation");

  }
};
