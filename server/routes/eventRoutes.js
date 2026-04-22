import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  approveEvent,
  getClubEvents,
  toggleLike
} from '../controllers/eventController.js';

import { protect, clubAdminOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, clubAdminOrAdmin, createEvent);

router.route('/club/:id/events')
  .get(protect, getClubEvents);

router.route('/:id')
  .get(getEventById)
  .put(protect, clubAdminOrAdmin, updateEvent)
  .delete(protect, clubAdminOrAdmin, deleteEvent);

// ✅ ADD HERE (separate route)
router.put('/:id/approve', protect, approveEvent);
router.put('/:id/like', protect, toggleLike);

export default router;