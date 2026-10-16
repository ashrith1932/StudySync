/**
 * User & Profile Controller
 * Member 2 (Backend & Auth) — Sprint 2
 *
 * Implements:
 *   - PUT /api/v1/users/profile
 *   - PUT /api/v1/users/availability
 *   - GET /api/v1/users/:id/profile
 */

import { userRepository, profileRepository } from '../repositories/user.repository.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Update authenticated user's academic profile (US-03 / FR-004)
 * PUT /api/v1/users/profile
 */
export function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { bio, major, academicYear, learningGoals, preferredSubjects } = req.body;

    let profile = profileRepository.findByUserId(userId);
    if (!profile) {
      profile = profileRepository.create(userId, {
        bio,
        major,
        academicYear,
        learningGoals,
        preferredSubjects,
      });
    } else {
      const updates = {};
      if (bio !== undefined) updates.bio = bio;
      if (major !== undefined) updates.major = major;
      if (academicYear !== undefined) updates.academic_year = academicYear;
      if (learningGoals !== undefined) updates.learning_goals = learningGoals;
      if (preferredSubjects !== undefined) updates.preferred_subjects = preferredSubjects;

      profile = profileRepository.update(userId, updates);
    }

    return sendSuccess(res, profile, 'Profile updated successfully.');
  } catch (err) {
    console.error('[updateProfile]', err);
    return sendError(res, 'Failed to update profile.', 500);
  }
}

/**
 * Update authenticated user's weekly recurring availability (US-03 / FR-005)
 * PUT /api/v1/users/availability
 */
export function updateAvailability(req, res) {
  try {
    const userId = req.user.id;
    const { availability } = req.body;

    let profile = profileRepository.findByUserId(userId);
    if (!profile) {
      profile = profileRepository.create(userId, { availability });
    } else {
      profile = profileRepository.update(userId, { availability });
    }

    return sendSuccess(res, profile, 'Availability updated successfully.');
  } catch (err) {
    console.error('[updateAvailability]', err);
    return sendError(res, 'Failed to update availability.', 500);
  }
}

/**
 * Get profile for specific user
 * GET /api/v1/users/:id/profile
 */
export function getProfileByUserId(req, res) {
  try {
    const targetUserId = req.params.id;
    const user = userRepository.findById(targetUserId);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    const profile = profileRepository.findByUserId(targetUserId);
    return sendSuccess(res, {
      user: userRepository.sanitize(user),
      profile,
    });
  } catch (err) {
    console.error('[getProfileByUserId]', err);
    return sendError(res, 'Failed to fetch user profile.', 500);
  }
}
