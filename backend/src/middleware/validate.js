/**
 * Validation Middleware (Zod)
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * Wraps Zod schema parsing into an Express middleware factory.
 * On failure returns 422 Unprocessable Entity with structured field errors.
 */

import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

/**
 * @param {import('zod').ZodSchema} schema - Zod schema with shape { body?, params?, query? }
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      // Merge sanitised/transformed values back
      req.body = result.body ?? req.body;
      req.params = result.params ?? req.params;
      req.query = result.query ?? req.query;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.slice(1).join('.'), // strip leading 'body'/'params'
          message: e.message,
        }));
        return sendError(res, 'Validation failed', 422, errors);
      }
      next(err);
    }
  };
}
