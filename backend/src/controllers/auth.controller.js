/**
 * Auth Controller
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * Handles: POST /api/v1/auth/register
 *          POST /api/v1/auth/login
 *          GET  /api/v1/auth/me
 *
 * Passwords are hashed with bcrypt (12 rounds per NFR-001).
 * Successful auth returns a signed JWT plus the sanitised user object.
 */

import bcrypt from 'bcryptjs';
import { userRepository, profileRepository } from '../repositories/user.repository.js';
import { signToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

// ── POST /api/v1/auth/register ─────────────────────────────────────────────
export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;

    // Check duplicate email (US-01)
    const existing = userRepository.findByEmail(email);
    if (existing) {
      return sendError(res, 'An account with this email already exists.', 409);
    }

    // Hash password (NFR-001: bcrypt)
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Persist user
    const user = userRepository.create({ email, password_hash, full_name: fullName });

    // Auto-create an empty profile so GET /me is always fully populated
    profileRepository.create(user.id);

    // Issue JWT
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return sendSuccess(
      res,
      { user: userRepository.sanitize(user), token },
      'Account created successfully.',
      201
    );
  } catch (err) {
    console.error('[register]', err);
    return sendError(res, 'Registration failed. Please try again.', 500);
  }
}

// ── POST /api/v1/auth/login ────────────────────────────────────────────────
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = userRepository.findByEmail(email);
    if (!user) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    // Check account is active
    if (!user.is_active) {
      return sendError(res, 'Your account has been deactivated.', 403);
    }

    // Timing-safe password comparison
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return sendSuccess(
      res,
      { user: userRepository.sanitize(user), token },
      'Login successful.'
    );
  } catch (err) {
    console.error('[login]', err);
    return sendError(res, 'Login failed. Please try again.', 500);
  }
}

// ── GET /api/v1/auth/me ────────────────────────────────────────────────────
export function getMe(req, res) {
  try {
    const user = userRepository.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }
    const profile = profileRepository.findByUserId(req.user.id);
    return sendSuccess(res, { user: userRepository.sanitize(user), profile });
  } catch (err) {
    console.error('[getMe]', err);
    return sendError(res, 'Failed to fetch user data.', 500);
  }
}
