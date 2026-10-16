/**
 * User & Profile Routes
 * Member 2 (Backend & Auth) — Sprint 2
 *
 * PUT /api/v1/users/profile       — Update major, goals, bio
 * PUT /api/v1/users/availability  — Update weekly schedule slots
 * GET /api/v1/users/:id/profile   — Get public profile of a student
 */

import { Router } from 'express';
import { updateProfile, updateAvailability, getProfileByUserId } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateSchema, availabilityUpdateSchema } from '../validators/membership.validator.js';

const router = Router();

router.put('/profile', protect, validate(profileUpdateSchema), updateProfile);
router.put('/availability', protect, validate(availabilityUpdateSchema), updateAvailability);
router.get('/:id/profile', protect, getProfileByUserId);

export default router;
