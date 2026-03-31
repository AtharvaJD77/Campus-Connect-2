import express from 'express';
import { followClub, unfollowClub, getMyFollowedClubs, getClubFollowers } from '../controllers/followerController.js';
import { protect, clubAdminOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/my-clubs').get(protect, getMyFollowedClubs);
router.route('/club/:id/follow').post(protect, followClub);
router.route('/club/:id/unfollow').post(protect, unfollowClub);
router.route('/club/:id/followers').get(protect, clubAdminOrAdmin, getClubFollowers);

export default router;
