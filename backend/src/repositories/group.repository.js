/**
 * Study Group & Membership Repository
 * Member 3 (Database & Matching) — Sprint 1
 *
 * CRUD and membership access patterns for study_groups and
 * group_memberships, backed by the in-memory store.
 */

import { findAll, findOne, insert, update, db } from '../config/db.js';

// ── Group operations ──────────────────────────────────────────────────────────

export const groupRepository = {
  /** Retrieve all public groups, optionally filtered by subjectId or search */
  findAll({ subjectId, search, visibility = 'public' } = {}) {
    let groups = findAll('study_groups', { visibility });
    if (subjectId) groups = groups.filter((g) => g.subject_id === subjectId);
    if (search) {
      const q = search.toLowerCase();
      groups = groups.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          (g.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return groups;
  },

  /** @returns {object|null} */
  findById(id) {
    return findOne('study_groups', { id });
  },

  /** @returns {object} newly created group */
  create({ name, description, subjectId, creatorId, maxMembers = 8, visibility = 'public', tags = [] }) {
    return insert('study_groups', {
      name,
      description,
      subject_id: subjectId,
      creator_id: creatorId,
      max_members: maxMembers,
      visibility,
      tags,
    });
  },

  /** Count accepted members in a group */
  memberCount(groupId) {
    return findAll('group_memberships', { group_id: groupId, status: 'accepted' }).length;
  },
};

// ── Membership operations ─────────────────────────────────────────────────────

export const membershipRepository = {
  /** @returns {object|null} */
  findByGroupAndUser(groupId, userId) {
    return findOne('group_memberships', { group_id: groupId, user_id: userId });
  },

  /** @returns {object[]} all memberships for a group, filtered by status */
  findByGroup(groupId, status = null) {
    const filter = { group_id: groupId };
    if (status) filter.status = status;
    return findAll('group_memberships', filter);
  },

  /** @returns {object[]} all groups a user belongs to (accepted) */
  findByUser(userId) {
    return findAll('group_memberships', { user_id: userId, status: 'accepted' });
  },

  /** Create a pending join request */
  create(groupId, userId, requestNote = '') {
    return insert('group_memberships', {
      group_id: groupId,
      user_id: userId,
      role: 'member',
      status: 'pending',
      request_note: requestNote,
      joined_at: null,
    });
  },

  /** Approve or reject a membership request */
  updateStatus(groupId, userId, status) {
    const joined_at = status === 'accepted' ? new Date().toISOString() : null;
    return update('group_memberships', { group_id: groupId, user_id: userId }, { status, joined_at });
  },

  /** Insert owner membership immediately with accepted status */
  addOwner(groupId, userId) {
    return insert('group_memberships', {
      group_id: groupId,
      user_id: userId,
      role: 'owner',
      status: 'accepted',
      joined_at: new Date().toISOString(),
    });
  },
};

// ── Subject operations ────────────────────────────────────────────────────────

export const subjectRepository = {
  findAll() {
    return db.subjects;
  },
  findById(id) {
    return findOne('subjects', { id });
  },
};
