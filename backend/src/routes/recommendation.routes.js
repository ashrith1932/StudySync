/**
 * Recommendation Routes
 * Member 2 (Backend & Auth) — Sprint 2
 *
 * GET /api/v1/recommendations/groups — Retrieve algorithmically ranked groups for caller
 */

import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { sendSuccess } from '../utils/response.js';
import { groupRepository } from '../repositories/group.repository.js';
import { profileRepository } from '../repositories/user.repository.js';

const router = Router();

router.get('/groups', protect, (req, res) => {
  const userId = req.user.id;
  const profile = profileRepository.findByUserId(userId) || {};
  const groups = groupRepository.findAll({ visibility: 'public' });

  // Baseline recommendation ranking according to Sprint 2 plan
  const ranked = groups.map((g) => {
    let score = 50; // default baseline score
    const breakdown = { subjectMatch: 20, scheduleMatch: 20, goalMatch: 10 };
    const matchedCriteria = [];

    if (profile.major && g.name.toLowerCase().includes(profile.major.toLowerCase())) {
      score += 20;
      matchedCriteria.push(`Major alignment: ${profile.major}`);
    }

    if (g.tags && profile.learning_goals) {
      const common = g.tags.filter((t) => profile.learning_goals.includes(t));
      if (common.length > 0) {
        score += 15;
        matchedCriteria.push(`Shared learning goals: ${common.join(', ')}`);
      }
    }

    const finalScore = Math.min(score, 98);

    return {
      groupId: g.id,
      groupName: g.name,
      description: g.description,
      maxMembers: g.max_members,
      currentMemberCount: groupRepository.memberCount(g.id),
      compatibilityScore: finalScore,
      breakdown,
      matchedCriteria: matchedCriteria.length > 0 ? matchedCriteria : ['Public group with open capacity'],
      tags: g.tags || [],
    };
  }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return sendSuccess(res, ranked, 'Recommended groups retrieved successfully.');
});

export default router;
