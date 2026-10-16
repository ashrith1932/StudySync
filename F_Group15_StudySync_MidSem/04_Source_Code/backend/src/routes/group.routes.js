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
import {
  requestToJoin,
  getPendingRequests,
  respondToRequest,
  getGroupMembers,
  getMyMemberships,
} from '../controllers/membership.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { createGroupSchema } from '../validators/group.validator.js';
import {
  joinRequestSchema,
  updateMembershipSchema,
} from '../validators/membership.validator.js';

const router = Router();

// Subjects catalogue (public)
router.get('/subjects', getSubjects);

// User memberships
router.get('/user/my-memberships', protect, getMyMemberships);

// Recommendations alias on /groups/recommendations
router.get('/recommendations', protect, (req, res, next) => {
  req.url = '/groups';
  import('./recommendation.routes.js').then((m) => m.default(req, res, next));
});

// Groups CRUD
router.get('/',    getGroups);
router.get('/:id', getGroupById);
router.post('/',   protect, validate(createGroupSchema), createGroup);

// Membership Workflow (Sprint 2 - US-05, US-06)
router.post('/:id/join', protect, validate(joinRequestSchema), requestToJoin);
router.get('/:id/requests', protect, getPendingRequests);
router.patch('/:id/requests/:userId', protect, validate(updateMembershipSchema), respondToRequest);

// Also mount /:id/members routes per API spec
router.get('/:id/members', protect, getGroupMembers);
router.patch('/:id/members/:userId', protect, validate(updateMembershipSchema), respondToRequest);

export default router;
