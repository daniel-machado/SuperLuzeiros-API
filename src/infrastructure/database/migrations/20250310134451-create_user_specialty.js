'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("user_specialty", {
      id: { 
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true, 
        references: { 
          model: 'users', 
          key: 'id' 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      specialtyId: { 
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true, 
        references: { 
          model: 'specialty', 
          key: 'id' 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      approvalStatus: { 
        type: Sequelize.ENUM("pending", "waiting_by_counselor", "waiting_by_lead", "waiting_by_director", 
          "rejected_by_counselor", "rejected_by_lead", "rejected_by_director", 
          "aprroved_by_counselor", "aprroved_by_lead", "aprroved_by_director", 
          "approved"
        ),
        allowNull: false,
        defaultValue: 'pending' 
      },
      report: { 
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rejectionComments: { 
        type: Sequelize.JSONB, 
        allowNull: true,
        defaultValue: []
      },
      approvalComments: { 
        type: Sequelize.JSONB, 
        allowNull: true,
        defaultValue: []
      },
      isQuizApproved: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
      },
      counselorApproval: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
      },
      leadApproval: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
      },
      directorApproval: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
      },
      counselorApprovalAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      leadApprovalAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      directorApprovalAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_specialty');
  }
};
