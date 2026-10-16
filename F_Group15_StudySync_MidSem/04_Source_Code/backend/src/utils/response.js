/**
 * Standard API Response Helpers
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * Enforces the authoritative response envelope:
 *   { success, data, meta, error }
 * as defined in docs/api/API_SPECIFICATION.md
 */

/**
 * Send a successful response.
 * @param {object} res - Express response object
 * @param {*} data - Payload to return
 * @param {string} [message] - Optional message
 * @param {number} [statusCode=200]
 * @param {object} [meta={}] - Pagination or extra metadata
 */
export function sendSuccess(res, data, message = 'OK', statusCode = 200, meta = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
}

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {string} message - Human-readable error message
 * @param {number} [statusCode=500]
 * @param {*} [errors=null] - Optional validation error array
 */
export function sendError(res, message, statusCode = 500, errors = null) {
  const body = { success: false, message, data: null };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}
