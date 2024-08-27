"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn(
                    "locations",
                    "organization_id",
                    {
                        allowNull: true,
                        type: Sequelize.INTEGER,
                        references: {
                            model: "organizations",
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
                queryInterface.removeColumn("locations", "organization_id", {
                    transaction: t,
                }),
            ]);
        });
    },
};
