import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";
import { authenticateToken, optionalAuthenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuthenticate, getAllPackages);
router.get("/:id", optionalAuthenticate, getPackageById);

router.post("/", authenticateToken, authorizeRoles("agency", "admin"), createPackage);
router.put("/:id", authenticateToken, authorizeRoles("agency", "admin"), updatePackage);
router.delete("/:id", authenticateToken, authorizeRoles("agency", "admin"), deletePackage);

export default router;
