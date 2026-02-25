import express from "express";
import { getAllPackages } from "../controllers/packageController.js";

const router = express.Router();

// Anyone can view packages
router.get("/", getAllPackages);

export default router;
