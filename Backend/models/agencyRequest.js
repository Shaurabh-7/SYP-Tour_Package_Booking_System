import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AgencyRequest = sequelize.define(
  "AgencyRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    agencyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },

    adminRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "agency_requests",
    timestamps: true,
  }
);

export default AgencyRequest;
