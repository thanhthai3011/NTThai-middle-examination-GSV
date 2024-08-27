"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn(
                    "devices",
                    "location_id",
                    {
                        allowNull: true,
                        type: Sequelize.INTEGER,
                        references: {
                            model: "locations",
                            key: "id",
                        },
                    },

                    { transaction: t },
                ),
            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn("devices", "location_id", {
                    transaction: t,
                }),
            ]);
        });
    },
};
