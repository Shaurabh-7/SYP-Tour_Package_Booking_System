import express from 'express';
import { submitContact, getAllContacts, getContactById, deleteContact } from '../controllers/contactController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public — anyone can submit a contact form
router.post('/', submitContact);

// Admin-only — view and manage contact submissions
router.get('/', authenticateToken, authorizeRoles('admin'), getAllContacts);
router.get('/:id', authenticateToken, authorizeRoles('admin'), getContactById);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteContact);

export default router;
