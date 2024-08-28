"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("assets", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING(254),
      },
      serial: {
        type: Sequelize.STRING(254),
      },
      status: {
        type: Sequelize.STRING(20),
      },
      description: {
        type: Sequelize.STRING(4000),
      },
      created_by: {
        type: Sequelize.STRING(20),
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      updated_by: {
        type: Sequelize.STRING(20),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("assets");
  },
};
