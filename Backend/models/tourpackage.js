import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Agency posts tour packages. Admin can manage all.
const TourPackage = sequelize.define(
  "TourPackage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: {
        isHttpUrl(value) {
          if (!value) return;

          try {
            const parsedUrl = new URL(value);
            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
              throw new Error("Image URL must start with http:// or https://");
            }
          } catch (error) {
            throw new Error("Image URL must be a valid http:// or https:// URL");
          }
        },
      },
    },
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "tour_packages",
    timestamps: true,
  }
);

export default TourPackage;
