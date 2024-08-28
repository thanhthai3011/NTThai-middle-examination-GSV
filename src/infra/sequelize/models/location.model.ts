module.exports = function (sequelize, DataTypes) {
    const Location = sequelize.define(
        "locations",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            organization_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING(254),
            },
            status: {
                type: DataTypes.STRING(20),
            },
            created_by: {
                type: DataTypes.STRING(20),
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: Date.now(),
            },
            updated_by: {
                type: DataTypes.STRING(20),
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: Date.now(),
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            paranoid: true,
            tableName: "locations",
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
        },
    );

    Location.associate = function (models) {
        Location.belongsTo(models.Organization, {
            foreignKey: "organization_id",
            as: "organization"
        })
        Location.hasMany(models.Device, {
            foreignKey: "location_id",
            as: "device",
        });
    };

    Location.beforeCreate(async (Location: any, options: any) => {

    });

    Location.beforeUpdate(async (Location: any, options: any) => {
        Location.updated_at = new Date();
    });

    return Location;
};
