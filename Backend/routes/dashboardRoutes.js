import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticateToken, authorizeRoles('admin', 'agency'), getDashboardStats);

export default router;
