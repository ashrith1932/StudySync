/**
 * Study Group Routes
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * GET  /api/v1/subjects         — List all academic subjects (US-04)
 * GET  /api/v1/groups           — Browse public study groups (US-04)
 * POST /api/v1/groups           — Create a study group (US-03) [protected]
 * GET  /api/v1/groups/:id       — Group detail + member list
 */

import { Router } from 'express';
import { getGroups, getGroupById, createGroup, getSubjects } from '../controllers/group.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { createGroupSchema } from '../validators/group.validator.js';

const router = Router();

// Subjects catalogue (public)
router.get('/subjects', getSubjects);

// Groups
router.get('/',    getGroups);
router.get('/:id', getGroupById);
router.post('/',   protect, validate(createGroupSchema), createGroup);

export default router;
