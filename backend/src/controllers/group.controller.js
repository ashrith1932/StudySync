/**
 * Group Controller
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * Handles:
 *   GET  /api/v1/groups          — Browse public groups (US-04)
 *   POST /api/v1/groups          — Create a study group (US-03)
 *   GET  /api/v1/groups/:id      — Get group detail with member count
 *   GET  /api/v1/subjects        — List all seeded subjects
 */

import { groupRepository, membershipRepository, subjectRepository } from '../repositories/group.repository.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── GET /api/v1/subjects ───────────────────────────────────────────────────
export function getSubjects(req, res) {
  const subjects = subjectRepository.findAll();
  return sendSuccess(res, subjects, 'Subjects retrieved.');
}

// ── GET /api/v1/groups ─────────────────────────────────────────────────────
export function getGroups(req, res) {
  const { subjectId, search } = req.query;
  const groups = groupRepository.findAll({ subjectId, search });

  // Enrich with live member count
  const enriched = groups.map((g) => ({
    ...g,
    memberCount: groupRepository.memberCount(g.id),
  }));

  return sendSuccess(res, enriched, 'Groups retrieved.', 200, { total: enriched.length });
}

// ── GET /api/v1/groups/:id ─────────────────────────────────────────────────
export function getGroupById(req, res) {
  const group = groupRepository.findById(req.params.id);
  if (!group) return sendError(res, 'Study group not found.', 404);

  const memberCount = groupRepository.memberCount(group.id);
  const members = membershipRepository.findByGroup(group.id, 'accepted');

  return sendSuccess(res, { ...group, memberCount, members });
}

// ── POST /api/v1/groups ────────────────────────────────────────────────────
export function createGroup(req, res) {
  const { name, description, subjectId, maxMembers, visibility, tags } = req.body;
  const creatorId = req.user.id;

  // Validate subject exists (US-03)
  const subject = subjectRepository.findById(subjectId);
  if (!subject) return sendError(res, 'Selected subject does not exist.', 422);

  // Create group
  const group = groupRepository.create({ name, description, subjectId, creatorId, maxMembers, visibility, tags });

  // Auto-enrol creator as owner with accepted status
  membershipRepository.addOwner(group.id, creatorId);

  return sendSuccess(
    res,
    { ...group, memberCount: 1 },
    'Study group created successfully.',
    201
  );
}
