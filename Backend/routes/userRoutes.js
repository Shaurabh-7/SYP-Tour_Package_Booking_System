import express from "express";
import {
  registerUser,
  createUserForAdmin,
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/create", authenticateToken, authorizeRoles("admin"), createUserForAdmin);

router.get("/", authenticateToken, authorizeRoles("admin"), getAllUsers);
router.get("/profile", authenticateToken, getProfile);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

export default router;