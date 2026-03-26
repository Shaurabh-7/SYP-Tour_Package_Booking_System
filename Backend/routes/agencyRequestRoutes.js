import express from "express";
import {
  submitRequest,
  getMyRequest,
  getAllRequests,
  handleRequest,
} from "../controllers/agencyRequestController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Customer routes
router.post("/", authenticateToken, authorizeRoles("customer"), submitRequest);
router.get("/mine", authenticateToken, getMyRequest);

// Admin routes
router.get("/", authenticateToken, authorizeRoles("admin"), getAllRequests);
router.put("/:id", authenticateToken, authorizeRoles("admin"), handleRequest);

export default router;
