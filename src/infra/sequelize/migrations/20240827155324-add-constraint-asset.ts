"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn(
                    "assets",
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
                queryInterface.removeColumn("assets", "location_id", {
                    transaction: t,
                }),
            ]);
        });
    },
};
