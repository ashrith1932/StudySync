/**
 * Auth Routes
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * POST   /api/v1/auth/register  — Create new user account (US-01)
 * POST   /api/v1/auth/login     — Authenticate and receive JWT (US-02)
 * GET    /api/v1/auth/me        — Return authenticated user (protected)
 */

import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.get('/me',        protect,                  getMe);

export default router;
