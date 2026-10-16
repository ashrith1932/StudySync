/**
 * Unit & Integration Test Suite — Algorithmic Peer & Group Matching Engine
 * Member 3 (DB & Matching) & Member 4 (Scheduling & QA) — Sprint 2
 *
 * Covers:
 *   [TC-011] Heuristic compatibility formula calculation (>= 80% match)
 *   [TC-012] Boundary conditions, empty profiles, and low compatibility (< 20% match)
 *   [TC-012-API] GET /api/v1/recommendations/groups security, ranking & pagination
 */

import request from 'supertest';
import app from '../src/app.js';
import {
  timeToMinutes,
  calculateSlotOverlap,
  calculateJaccardSimilarity,
  calculateGroupCompatibility,
} from '../src/services/matching.service.js';
import { db } from '../src/config/db.js';

describe('Sprint 2 Matching Engine Unit Tests', () => {
  describe('Time and Overlap Utilities', () => {
    test('timeToMinutes correctly converts 24h strings', () => {
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('09:30')).toBe(570);
      expect(timeToMinutes('14:45')).toBe(885);
      expect(timeToMinutes('23:59')).toBe(1439);
      expect(timeToMinutes('')).toBe(0);
      expect(timeToMinutes(null)).toBe(0);
    });

    test('calculateSlotOverlap returns exact overlap in minutes for same day', () => {
      const slotA = { dayOfWeek: 'monday', startTime: '14:00', endTime: '16:00' };
      const slotB = { dayOfWeek: 'Monday', startTime: '15:00', endTime: '17:00' };
      // Overlap: 15:00 to 16:00 = 60 minutes
      expect(calculateSlotOverlap(slotA, slotB)).toBe(60);
    });

    test('calculateSlotOverlap returns 0 for different days or non-overlapping hours', () => {
      const slotA = { dayOfWeek: 'monday', startTime: '10:00', endTime: '12:00' };
      const slotB = { dayOfWeek: 'tuesday', startTime: '10:00', endTime: '12:00' };
      expect(calculateSlotOverlap(slotA, slotB)).toBe(0);

      const slotC = { dayOfWeek: 'monday', startTime: '14:00', endTime: '16:00' };
      expect(calculateSlotOverlap(slotA, slotC)).toBe(0);
    });
  });

  describe('Jaccard Similarity for Learning Goals', () => {
    test('computes exact 1.0 coefficient for identical sets', () => {
      const { coefficient, intersection } = calculateJaccardSimilarity(
        ['exam-prep', 'web-dev'],
        ['web-dev', 'exam-prep']
      );
      expect(coefficient).toBe(1);
      expect(intersection.length).toBe(2);
    });

    test('computes 0 coefficient for disjoint sets or empty inputs', () => {
      expect(calculateJaccardSimilarity(['algo'], ['math']).coefficient).toBe(0);
      expect(calculateJaccardSimilarity([], ['math']).coefficient).toBe(0);
      expect(calculateJaccardSimilarity(null, null).coefficient).toBe(0);
    });

    test('computes partial Jaccard index accurately', () => {
      // A = ['a', 'b'], B = ['b', 'c'] -> intersection = ['b'], union = ['a', 'b', 'c'] -> 1/3
      const { coefficient, intersection } = calculateJaccardSimilarity(['a', 'b'], ['b', 'c']);
      expect(coefficient).toBeCloseTo(1 / 3, 2);
      expect(intersection).toEqual(['b']);
    });
  });

  describe('[TC-011] High Compatibility Heuristic Calculation', () => {
    test('calculates >= 80% score when subject matches, schedules overlap, and goals align', () => {
      const groupSubject = db.subjects.find((s) => s.code === 'CS301') || db.subjects[0];

      const userProfile = {
        major: 'Computer Science',
        preferred_subjects: [groupSubject.code],
        learning_goals: ['exam-prep', 'project-collab'],
        availability: [
          { dayOfWeek: 'tuesday', startTime: '14:00', endTime: '17:00' },
          { dayOfWeek: 'thursday', startTime: '10:00', endTime: '13:00' },
        ],
      };

      const group = {
        name: 'CS301 Software Engineering Circle',
        description: 'Collaborative group for CS301 coursework',
        subject_id: groupSubject.id,
        tags: ['exam-prep', 'coursework'],
        meeting_slots: [
          { dayOfWeek: 'tuesday', startTime: '15:00', endTime: '17:00' },
          { dayOfWeek: 'thursday', startTime: '11:00', endTime: '13:00' },
        ],
      };

      const result = calculateGroupCompatibility(userProfile, group, groupSubject);

      expect(result.overallScore).toBeGreaterThanOrEqual(80);
      expect(result.matchLabel).toBe('High Compatibility');
      expect(result.breakdown.subjectScore).toBe(40);
      expect(result.breakdown.scheduleScore).toBeGreaterThanOrEqual(25);
      expect(result.breakdown.goalsScore).toBeGreaterThanOrEqual(8);
      expect(result.matchedCriteria.length).toBeGreaterThanOrEqual(2);
      expect(result.matchedCriteria.some((c) => c.includes('Direct course match'))).toBe(true);
    });
  });

  describe('[TC-012] Boundary Conditions & Low Compatibility', () => {
    test('calculates < 20% score for disjoint subjects, schedules, and goals', () => {
      const csSubject = db.subjects.find((s) => s.code === 'CS301') || db.subjects[0];

      const userProfile = {
        major: 'Humanities',
        preferred_subjects: ['HU101'],
        learning_goals: ['creative-writing'],
        availability: [
          { dayOfWeek: 'sunday', startTime: '08:00', endTime: '10:00' },
        ],
      };

      const group = {
        name: 'CS301 Hardcore Algorithms',
        description: 'Advanced CS algorithms group',
        subject_id: csSubject.id,
        tags: ['machine-learning', 'python'],
        meeting_slots: [
          { dayOfWeek: 'wednesday', startTime: '16:00', endTime: '18:00' },
        ],
      };

      const result = calculateGroupCompatibility(userProfile, group, csSubject);

      expect(result.overallScore).toBeLessThan(20);
      expect(result.matchLabel).toBe('Low Compatibility');
      expect(result.breakdown.subjectScore).toBe(0);
      expect(result.breakdown.scheduleScore).toBe(0);
      expect(result.breakdown.goalsScore).toBe(0);
    });

    test('gracefully handles empty profile without throwing runtime errors', () => {
      const group = {
        name: 'General Math Study',
        description: 'Math basics',
        tags: [],
      };

      const result = calculateGroupCompatibility({}, group, null);

      expect(result.overallScore).toBe(0);
      expect(result.matchLabel).toBe('Low Compatibility');
      expect(result.breakdown.subjectScore).toBe(0);
      expect(result.breakdown.scheduleScore).toBe(0);
      expect(result.breakdown.goalsScore).toBe(0);
      expect(result.matchedCriteria).toEqual(['Public group with open membership capacity']);
    });
  });
});

describe('Sprint 2 Recommendations API Integration Tests', () => {
  let studentToken;
  let studentUser;
  let testSubject;

  beforeAll(async () => {
    testSubject = db.subjects.find((s) => s.code === 'CS301') || db.subjects[0];

    // 1. Register a student with defined academic preferences
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Grace Hopper',
        email: 'grace.hopper@university.edu',
        password: 'Password123!',
      });
    expect(regRes.status).toBe(201);
    studentToken = regRes.body.data.token;
    studentUser = regRes.body.data.user;

    // 2. Set student profile preferences
    await request(app)
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        major: 'Computer Science',
        academicYear: 'Senior',
        learningGoals: ['exam-prep', 'research'],
        preferredSubjects: [testSubject.code],
      });

    // 3. Set student availability
    await request(app)
      .put('/api/v1/users/availability')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        availability: [
          { dayOfWeek: 'monday', startTime: '14:00', endTime: '18:00' },
          { dayOfWeek: 'wednesday', startTime: '10:00', endTime: '13:00' },
        ],
      });

    // 4. Create sample study groups
    await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'High Match SE Group',
        description: 'Targeted group for Software Engineering CS301',
        subjectId: testSubject.id,
        maxMembers: 6,
        visibility: 'public',
        tags: ['exam-prep', 'software-engineering'],
      });

    const otherSubject = db.subjects.find((s) => s.code === 'HU101') || db.subjects[1];
    await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'Low Match Humanities Circle',
        description: 'General reading discussion',
        subjectId: otherSubject.id,
        maxMembers: 10,
        visibility: 'public',
        tags: ['literature'],
      });
  });

  test('[TC-012-API] GET /api/v1/recommendations/groups requires Bearer authentication', async () => {
    const res = await request(app).get('/api/v1/recommendations/groups');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('[TC-012-API] GET /api/v1/recommendations/groups returns sorted recommendations with breakdown', async () => {
    const res = await request(app)
      .get('/api/v1/recommendations/groups')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    const items = res.body.data;
    // Verify descending sort order by compatibility score
    for (let i = 0; i < items.length - 1; i++) {
      expect(items[i].compatibilityScore).toBeGreaterThanOrEqual(items[i + 1].compatibilityScore);
    }

    // Verify properties of top match
    const topMatch = items[0];
    expect(topMatch).toHaveProperty('groupId');
    expect(topMatch).toHaveProperty('groupName');
    expect(topMatch).toHaveProperty('compatibilityScore');
    expect(topMatch).toHaveProperty('breakdown');
    expect(topMatch.breakdown).toHaveProperty('subjectScore');
    expect(topMatch.breakdown).toHaveProperty('scheduleScore');
    expect(topMatch.breakdown).toHaveProperty('goalsScore');
    expect(Array.isArray(topMatch.matchedCriteria)).toBe(true);
  });

  test('[TC-012-API] supports limit and offset pagination parameters', async () => {
    const res = await request(app)
      .get('/api/v1/recommendations/groups?limit=1&offset=0')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.meta.limit).toBe(1);
    expect(res.body.meta.offset).toBe(0);
  });
});
