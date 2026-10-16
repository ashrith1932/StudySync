/**
 * StudySync Deterministic Peer & Group Matching Engine
 * Member 3 (Database & Matching) — Sprint 2
 *
 * Implements multi-variable compatibility scoring model:
 *   Score = W_subject * S_subject + W_schedule * S_schedule + W_goals * S_goals
 *
 * Weights:
 *   W_subject  = 0.40 (Max 40 points)
 *   W_schedule = 0.40 (Max 40 points)
 *   W_goals    = 0.20 (Max 20 points)
 *
 * Total Score in [0, 100] with explainable breakdown.
 */

import { groupRepository, subjectRepository } from '../repositories/group.repository.js';
import { profileRepository, userRepository } from '../repositories/user.repository.js';

/**
 * Converts "HH:MM" (24-hour) string to minutes from midnight
 * @param {string} timeStr - e.g. "14:30"
 * @returns {number}
 */
export function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return 0;
  return parts[0] * 60 + parts[1];
}

/**
 * Calculates overlap duration in minutes between two availability slots
 * @param {object} slotA - { dayOfWeek, startTime, endTime }
 * @param {object} slotB - { dayOfWeek, startTime, endTime }
 * @returns {number} overlap in minutes (0 if no overlap or different days)
 */
export function calculateSlotOverlap(slotA, slotB) {
  if (!slotA || !slotB) return 0;
  const dayA = String(slotA.dayOfWeek || '').trim().toLowerCase();
  const dayB = String(slotB.dayOfWeek || '').trim().toLowerCase();
  if (!dayA || !dayB || dayA !== dayB) return 0;

  const startA = timeToMinutes(slotA.startTime);
  const endA = timeToMinutes(slotA.endTime);
  const startB = timeToMinutes(slotB.startTime);
  const endB = timeToMinutes(slotB.endTime);

  const overlapStart = Math.max(startA, startB);
  const overlapEnd = Math.min(endA, endB);

  return overlapEnd > overlapStart ? overlapEnd - overlapStart : 0;
}

/**
 * Computes Jaccard Similarity between two string arrays:
 * J(A, B) = |A ∩ B| / |A ∪ B|
 * @param {string[]} listA
 * @param {string[]} listB
 * @returns {{ coefficient: number, intersection: string[] }}
 */
export function calculateJaccardSimilarity(listA = [], listB = []) {
  const normA = new Set((listA || []).map((s) => String(s).trim().toLowerCase()).filter(Boolean));
  const normB = new Set((listB || []).map((s) => String(s).trim().toLowerCase()).filter(Boolean));

  if (normA.size === 0 || normB.size === 0) {
    return { coefficient: 0, intersection: [] };
  }

  const intersection = [];
  for (const item of normA) {
    if (normB.has(item)) {
      intersection.push(item);
    }
  }

  const unionSize = new Set([...normA, ...normB]).size;
  const coefficient = unionSize > 0 ? intersection.length / unionSize : 0;

  return { coefficient, intersection };
}

/**
 * Calculates deterministic compatibility score between a user profile and a study group
 *
 * @param {object} userProfile - User academic profile (major, availability, preferred_subjects, learning_goals)
 * @param {object} group - Study group record
 * @param {object} [subject=null] - Pre-fetched Subject entity for the group
 * @returns {object} compatibility details including overallScore, breakdown, and matchedCriteria
 */
export function calculateGroupCompatibility(userProfile = {}, group = {}, subject = null) {
  const matchedCriteria = [];

  // Resolved Subject
  const groupSubject = subject || (group.subject_id ? subjectRepository.findById(group.subject_id) : null);
  const subjectCode = groupSubject?.code || '';
  const subjectDept = groupSubject?.department || '';
  const subjectName = groupSubject?.name || '';

  // ── Component 1: Subject Alignment (W = 0.40, Max 40 points) ───────────────────
  let subjectScore = 0;
  const preferredSubjects = (userProfile?.preferred_subjects || []).map((s) => String(s).trim().toLowerCase());
  const userMajor = String(userProfile?.major || '').trim().toLowerCase();

  const codeLower = subjectCode.toLowerCase();
  const deptLower = subjectDept.toLowerCase();
  const nameLower = subjectName.toLowerCase();

  const isDirectMatch =
    (codeLower && preferredSubjects.includes(codeLower)) ||
    (group.subject_id && preferredSubjects.includes(group.subject_id.toLowerCase())) ||
    (nameLower && preferredSubjects.includes(nameLower));

  if (isDirectMatch) {
    subjectScore = 40;
    matchedCriteria.push(`Direct course match: ${subjectCode || subjectName}`);
  } else if (
    (userMajor && (deptLower.includes(userMajor) || userMajor.includes(deptLower))) ||
    (codeLower && preferredSubjects.some((ps) => ps.slice(0, 2) === codeLower.slice(0, 2))) ||
    (userMajor && nameLower.includes(userMajor))
  ) {
    subjectScore = 25;
    matchedCriteria.push(`Department alignment: ${subjectDept || subjectCode}`);
  } else if (group.name && userMajor && group.name.toLowerCase().includes(userMajor)) {
    subjectScore = 20;
    matchedCriteria.push(`Major relevance: ${userProfile.major}`);
  } else {
    subjectScore = 0;
  }

  // ── Component 2: Schedule Overlap (W = 0.40, Max 40 points) ─────────────────────
  let scheduleScore = 0;
  const studentAvailability = Array.isArray(userProfile?.availability) ? userProfile.availability : [];

  // Determine group meeting slots: check explicit meeting_slots, or fallback to creator's availability
  let groupSlots = Array.isArray(group.meeting_slots) && group.meeting_slots.length > 0
    ? group.meeting_slots
    : (Array.isArray(group.availability) && group.availability.length > 0 ? group.availability : []);

  if (groupSlots.length === 0 && group.creator_id) {
    const creatorProf = profileRepository.findByUserId(group.creator_id);
    if (creatorProf && Array.isArray(creatorProf.availability) && creatorProf.availability.length > 0) {
      groupSlots = creatorProf.availability;
    }
  }

  if (studentAvailability.length > 0 && groupSlots.length > 0) {
    let totalOverlapMinutes = 0;
    let overlappingSlotCount = 0;

    for (const sSlot of studentAvailability) {
      for (const gSlot of groupSlots) {
        const overlap = calculateSlotOverlap(sSlot, gSlot);
        if (overlap > 0) {
          totalOverlapMinutes += overlap;
          overlappingSlotCount++;
        }
      }
    }

    if (overlappingSlotCount > 0) {
      // 1 slot overlap -> ~25 pts, 2 slots -> 35 pts, 3+ slots -> 40 pts max
      if (overlappingSlotCount === 1) {
        scheduleScore = Math.min(25, Math.max(15, Math.round(totalOverlapMinutes / 4)));
      } else if (overlappingSlotCount === 2) {
        scheduleScore = Math.min(35, Math.max(25, Math.round(totalOverlapMinutes / 3.5)));
      } else {
        scheduleScore = 40;
      }
      matchedCriteria.push(`${overlappingSlotCount} overlapping weekly study slot${overlappingSlotCount > 1 ? 's' : ''}`);
    } else {
      scheduleScore = 0;
    }
  } else if (studentAvailability.length > 0 && Array.isArray(group.tags)) {
    // Check if group tags designate days/times (e.g. 'monday', 'evening', 'weekend')
    const dayTags = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const matchedDays = studentAvailability
      .map((s) => String(s.dayOfWeek || '').toLowerCase())
      .filter((day) => group.tags.some((t) => t.toLowerCase().includes(day) || dayTags.includes(t.toLowerCase())));

    if (matchedDays.length > 0) {
      scheduleScore = Math.min(25, matchedDays.length * 12);
      matchedCriteria.push(`Compatible schedule day(s): ${[...new Set(matchedDays)].join(', ')}`);
    } else {
      scheduleScore = 0;
    }
  } else {
    scheduleScore = 0;
  }

  // ── Component 3: Learning Goal Similarity (W = 0.20, Max 20 points) ────────────
  let goalsScore = 0;
  const userGoals = Array.isArray(userProfile?.learning_goals) ? userProfile.learning_goals : [];
  const groupTags = Array.isArray(group.tags) ? group.tags : [];

  const { coefficient, intersection } = calculateJaccardSimilarity(userGoals, groupTags);
  if (intersection.length > 0) {
    // Jaccard similarity scaled to max 20 points
    goalsScore = Math.min(20, Math.max(8, Math.round(coefficient * 20) + (intersection.length >= 2 ? 5 : 0)));
    matchedCriteria.push(`Shared learning goal${intersection.length > 1 ? 's' : ''}: ${intersection.join(', ')}`);
  } else {
    goalsScore = 0;
  }

  // ── Overall Normalized Score ──────────────────────────────────────────────────
  const rawScore = subjectScore + scheduleScore + goalsScore;
  const overallScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Match category label
  let matchLabel = 'Low Compatibility';
  if (overallScore >= 80) {
    matchLabel = 'High Compatibility';
  } else if (overallScore >= 50) {
    matchLabel = 'Moderate Compatibility';
  }

  if (matchedCriteria.length === 0) {
    matchedCriteria.push('Public group with open membership capacity');
  }

  return {
    overallScore,
    compatibilityScore: overallScore, // for backward/frontend compatibility
    matchLabel,
    breakdown: {
      subjectScore,
      scheduleScore,
      goalsScore,
      // Duplicated property names for frontend convenience
      subjectMatch: subjectScore,
      scheduleMatch: scheduleScore,
      goalMatch: goalsScore,
    },
    matchedCriteria,
  };
}

/**
 * Returns algorithmically ranked study group recommendations for a given student
 *
 * @param {string} userId - ID of calling user
 * @param {object} [options={}] - Query options (limit, offset)
 * @returns {Array<object>}
 */
export function getRecommendationsForUser(userId, { limit = 20, offset = 0 } = {}) {
  const profile = profileRepository.findByUserId(userId) || {};
  const allPublicGroups = groupRepository.findAll({ visibility: 'public' });

  // Map each group with its computed compatibility details
  const ranked = allPublicGroups.map((group) => {
    const subject = group.subject_id ? subjectRepository.findById(group.subject_id) : null;
    const compatibility = calculateGroupCompatibility(profile, group, subject);
    const currentMemberCount = groupRepository.memberCount(group.id);

    return {
      groupId: group.id,
      groupName: group.name,
      description: group.description,
      subjectId: group.subject_id,
      subjectCode: subject?.code || '',
      subjectName: subject?.name || '',
      maxMembers: group.max_members,
      currentMemberCount,
      ...compatibility,
      tags: group.tags || [],
    };
  });

  // Sort descending by compatibility score
  ranked.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return ranked.slice(offset, offset + limit);
}
