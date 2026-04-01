import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createMessage, getMessages } from '../controllers/messageController.js';

const router = express.Router();

// GET /api/messages/:eventId 
router.get('/:eventId', protect, getMessages);

// POST /api/messages/:eventId (Restricted by controller)
router.post('/:eventId', protect, createMessage);

export default router;
