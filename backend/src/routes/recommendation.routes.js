/**
 * Recommendation Routes
 * Member 2 (Backend & Auth) — Sprint 2
 *
 * GET /api/v1/recommendations/groups — Retrieve algorithmically ranked groups for caller
 */

import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getRecommendedGroups } from '../controllers/recommendation.controller.js';

const router = Router();

router.get('/groups', protect, getRecommendedGroups);

export default router;
