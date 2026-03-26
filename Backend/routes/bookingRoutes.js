import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("customer"), createBooking);
router.get("/", authenticateToken, getAllBookings);
router.get("/:id", authenticateToken, getBookingById);
router.put("/:id", authenticateToken, updateBooking);
router.delete("/:id", authenticateToken, deleteBooking);

export default router;
