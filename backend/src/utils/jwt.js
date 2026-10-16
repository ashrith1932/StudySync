/**
 * JWT Token Utilities
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * Signs and verifies JWTs using the secret from env.
 * Algorithm: HS256 | Expiry: configurable via JWT_EXPIRES_IN (default 24h)
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'studysync_dev_secret_key_minimum_32_chars';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a signed JWT for the authenticated user.
 * @param {object} payload - { id, email, role }
 * @returns {string} JWT token string
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT string.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 * @param {string} token
 * @returns {object} decoded payload
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
