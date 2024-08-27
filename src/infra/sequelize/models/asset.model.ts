module.exports = function (sequelize, DataTypes) {
  const Asset = sequelize.define(
    "assets",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(254),
      },
      type: {
        type: DataTypes.STRING(254),
      },
      serial_number: {
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
      tableName: "assets",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  Asset.associate = function (models) {
    Asset.belongTo(models.Location, {
      foreignKey: "location_id",
      as: "location",
    });
  };

  Asset.beforeCreate(async (Asset: any, options: any) => {});

  Asset.beforeUpdate(async (Asset: any, options: any) => {
    Asset.updated_at = new Date();
  });

  return Asset;
};
