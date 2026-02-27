import express from 'express';

import user from './userRoutes.js';
import auth from './authRoutes.js';
import packageRoutes from './packageRoutes.js';

const router = express.Router();

router.use('/users', user);
router.use('/auth', auth);
router.use('/packages', packageRoutes);

export default router;