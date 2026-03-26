import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getMyNotifications);
router.put("/read-all", authenticateToken, markAllAsRead);
router.put("/:id/read", authenticateToken, markAsRead);

export default router;
