import express from 'express';
import { submitFeedback, getEventFeedback } from '../controllers/feedbackController.js';
import { protect, roleCheck } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student can submit feedback
router.post('/', protect, roleCheck('Student'), submitFeedback);

// Club Admin can view feedback for their events (or System Admin)
router.get('/event/:eventId', protect, getEventFeedback);

export default router;
