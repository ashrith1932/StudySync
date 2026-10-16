/**
 * User Repository
 * Member 3 (Database & Matching) — Sprint 1
 *
 * Provides all data-access operations for the `users` and
 * `user_profiles` tables, backed by the in-memory store.
 * When switching to PostgreSQL, only this file changes.
 */

import { findOne, findAll, insert, update } from '../config/db.js';

// ── User operations ───────────────────────────────────────────────────────────

export const userRepository = {
  /** @returns {object|null} */
  findById(id) {
    return findOne('users', { id });
  },

  /** @returns {object|null} */
  findByEmail(email) {
    return findOne('users', { email: email.toLowerCase() });
  },

  /** @returns {object} newly created user (password_hash included) */
  create({ email, password_hash, full_name, role = 'student' }) {
    return insert('users', {
      email: email.toLowerCase(),
      password_hash,
      full_name,
      role,
      is_active: true,
    });
  },

  /** Strip password_hash before returning to client */
  sanitize(user) {
    if (!user) return null;
    const { password_hash, ...safe } = user;
    return safe;
  },
};

// ── Profile operations ────────────────────────────────────────────────────────

export const profileRepository = {
  /** @returns {object|null} */
  findByUserId(userId) {
    return findOne('user_profiles', { user_id: userId });
  },

  /** @returns {object} newly created profile */
  create(userId, profileData = {}) {
    return insert('user_profiles', {
      user_id: userId,
      bio: profileData.bio || null,
      major: profileData.major || null,
      academic_year: profileData.academicYear || null,
      learning_goals: profileData.learningGoals || [],
      preferred_subjects: profileData.preferredSubjects || [],
      availability: profileData.availability || [],
    });
  },

  /** @returns {object|null} updated profile */
  update(userId, changes) {
    return update('user_profiles', { user_id: userId }, changes);
  },
};
