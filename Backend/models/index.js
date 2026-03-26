import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import TourPackage from "./tourpackage.js";
import Booking from "./booking.js";
import Contact from "./contact.js";
import AgencyRequest from "./agencyRequest.js";
import Notification from "./notification.js";

// Associations
User.hasMany(TourPackage, { foreignKey: "agencyId" });
TourPackage.belongsTo(User, { foreignKey: "agencyId", as: "agency" });

User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });
TourPackage.hasMany(Booking, { foreignKey: "packageId" });
Booking.belongsTo(TourPackage, { foreignKey: "packageId" });

User.hasOne(AgencyRequest, { foreignKey: "userId" });
AgencyRequest.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

export {
  sequelize,
  User,
  TourPackage,
  Booking,
  Contact,
  AgencyRequest,
  Notification,
};
