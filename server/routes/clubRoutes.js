import express from 'express';
import { createClub, getClubs, getAllClubsAdmin, getClubById, verifyClub, updateClub } from '../controllers/clubController.js';
import { protect, adminOnly, clubAdminOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getClubs)
  .post(protect, clubAdminOrAdmin, createClub);

router.route('/all')
  .get(protect, adminOnly, getAllClubsAdmin);

router.route('/:id')
  .get(getClubById)
  .put(protect, updateClub);

router.route('/:id/verify')
  .put(protect, adminOnly, verifyClub);

export default router;
