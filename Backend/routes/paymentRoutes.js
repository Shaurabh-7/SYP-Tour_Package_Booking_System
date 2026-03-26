import express from 'express';
import { initiatePayment, verifyPayment } from '../controllers/paymentController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/initiate', authenticateToken, authorizeRoles('customer'), initiatePayment);
router.post('/verify', verifyPayment);

export default router;
