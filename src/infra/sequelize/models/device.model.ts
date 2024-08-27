module.exports = function (sequelize, DataTypes) {
  const Device = sequelize.define(
    "devices",
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
      tableName: "devices",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  Device.associate = function (models) {
    Device.belongTo(models.Location, {
      foreignKey: "location_id",
      as: "location",
    });
  };

  Device.beforeCreate(async (Device: any, options: any) => {});

  Device.beforeUpdate(async (Device: any, options: any) => {
    Device.updated_at = new Date();
  });

  return Device;
};
