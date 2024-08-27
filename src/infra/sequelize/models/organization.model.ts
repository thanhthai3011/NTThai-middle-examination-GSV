module.exports = function (sequelize, DataTypes) {
    const Organization = sequelize.define(
        "organizations",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(254),
            },
            description: {
                type: DataTypes.STRING(4000),
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
            tableName: "organizations",
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
        },
    );

    Organization.associate = function (models) {
        Organization.hasMany(models.Location, {
            foreignKey: "organization_id",
            as: "location",
        });
    };

    Organization.beforeCreate(async (Organization: any, options: any) => {

    });

    Organization.beforeUpdate(async (Organization: any, options: any) => {
        Organization.updated_at = new Date();
    });

    return Organization;
};
