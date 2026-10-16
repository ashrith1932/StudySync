/**
 * Recommendation Controller
 * Member 3 (Database & Matching) & Member 2 (Backend & Auth) — Sprint 2
 *
 * Exposes algorithmic recommendations endpoints for study groups and peers.
 */

import { getRecommendationsForUser } from '../services/matching.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/v1/recommendations/groups
 * Retrieves algorithmically ranked study groups for the authenticated student.
 */
export function getRecommendedGroups(req, res) {
  const userId = req.user.id;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

  const recommendations = getRecommendationsForUser(userId, { limit, offset });

  return sendSuccess(
    res,
    recommendations,
    'Recommended groups retrieved successfully.',
    200,
    { total: recommendations.length, limit, offset }
  );
}
