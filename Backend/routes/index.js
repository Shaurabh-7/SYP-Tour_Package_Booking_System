import express from 'express';

import user from './userRoutes.js';
import auth from './authRoutes.js';
import packageRoutes from './packageRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import contactRoutes from './contactRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import agencyRequestRoutes from './agencyRequestRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = express.Router();

router.use('/users', user);
router.use('/auth', auth);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/contacts', contactRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/agency-requests', agencyRequestRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payments', paymentRoutes);

export default router;