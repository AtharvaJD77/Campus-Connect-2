import express from 'express';
import { registerForEvent, cancelRegistration, getMyRegistrations, getEventRegistrations, updateRegistrationStatus, getMyRegistrationStatus } from '../controllers/registrationController.js';
import { protect, clubAdminOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/my-events').get(protect, getMyRegistrations);
router.route('/my-status/:id').get(protect, getMyRegistrationStatus);
router.route('/event/:id/register').post(protect, registerForEvent);
router.route('/event/:id/cancel').post(protect, cancelRegistration);
router.route('/event/:id/registrations').get(protect, clubAdminOrAdmin, getEventRegistrations);
router.route('/:id/status').put(protect, clubAdminOrAdmin, updateRegistrationStatus);

export default router;
