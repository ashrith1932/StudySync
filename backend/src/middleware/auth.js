/**
 * Authentication Middleware — Protect Route Guard
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * Reads the Bearer token from the Authorization header,
 * verifies it with verifyToken(), and attaches the decoded
 * user payload to req.user for downstream controllers.
 */

import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

/**
 * Express middleware that protects routes requiring authentication.
 * Attach this before any route handler that requires an authenticated user.
 */
export function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Please log in.', 401);
  }

  const token = header.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid authentication token.', 401);
  }
}
