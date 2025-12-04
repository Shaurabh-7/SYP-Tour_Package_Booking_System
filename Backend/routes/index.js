import express from 'express';

import user from './userRoutes.js';
import auth from './authRoutes.js';

const router = express.Router();

router.use('/users', user);
router.use('/auth', auth);

export default router;