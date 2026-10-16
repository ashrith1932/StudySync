/**
 * StudySync System & User Acceptance Test (UAT) Suite
 * Member 4 (QA & Lead) — Sprint 2 Verification
 *
 * Implements end-to-end multi-user journey testing based on formal
 * Acceptance Criteria (Given-When-Then specification).
 *
 * Scenarios:
 *   1. Student Registration & Academic Profile / Availability Setup (US-01, US-03)
 *   2. Study Group Creation & Public Catalog Discovery (US-04)
 *   3. Algorithmic Peer Compatibility Recommendation (US-07)
 *   4. Collaborative Membership Lifecycle: Request -> Review -> Approve -> Roster (US-05, US-06)
 *   5. Capacity Invariant & Role Security Guard (US-06, NFR-004)
 */

import request from 'supertest';
import app from '../src/app.js';
import { db } from '../src/config/db.js';

describe('StudySync System & User Acceptance Tests (UAT)', () => {
  let aliceToken;
  let aliceUser;
  let bobToken;
  let bobUser;
  let charlieToken;
  let testSubject;
  let createdGroupId;

  beforeAll(async () => {
    testSubject = db.subjects.find((s) => s.code === 'CS301') || db.subjects[0];
  });

  // ── Acceptance Scenario 1 ───────────────────────────────────────────────────
  describe('Acceptance Scenario 1: Student Onboarding & Academic Profile Setup', () => {
    it('GIVEN a new student (Alice), WHEN she registers, THEN she receives a JWT token and default profile', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Alice Walker',
          email: 'alice.uat@university.edu',
          password: 'Password123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('alice.uat@university.edu');
      expect(res.body.data.user.password_hash).toBeUndefined();

      aliceToken = res.body.data.token;
      aliceUser = res.body.data.user;
    });

    it('GIVEN Alice is authenticated, WHEN she updates major and availability, THEN her preferences persist', async () => {
      const profileRes = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${aliceToken}`)
        .send({
          major: 'Computer Science',
          academicYear: 'Junior',
          learningGoals: ['exam-prep', 'coursework'],
          preferredSubjects: [testSubject.code],
        });

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.data.major).toBe('Computer Science');

      const availRes = await request(app)
        .put('/api/v1/users/availability')
        .set('Authorization', `Bearer ${aliceToken}`)
        .send({
          availability: [
            { dayOfWeek: 'monday', startTime: '14:00', endTime: '18:00' },
            { dayOfWeek: 'wednesday', startTime: '14:00', endTime: '18:00' },
          ],
        });

      expect(availRes.status).toBe(200);
      expect(availRes.body.data.availability.length).toBe(2);
    });
  });

  // ── Acceptance Scenario 2 ───────────────────────────────────────────────────
  describe('Acceptance Scenario 2: Group Creation & Public Catalog Discovery', () => {
    it('GIVEN Alice is onboarded, WHEN she creates a study group, THEN she is enrolled as owner and group is listed', async () => {
      const createRes = await request(app)
        .post('/api/v1/groups')
        .set('Authorization', `Bearer ${aliceToken}`)
        .send({
          name: 'UAT Software Engineering Circle',
          description: 'Focused study group for CS301 project milestones',
          subjectId: testSubject.id,
          maxMembers: 2, // Low capacity for boundary test
          visibility: 'public',
          tags: ['exam-prep', 'sepm'],
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.data.name).toBe('UAT Software Engineering Circle');
      createdGroupId = createRes.body.data.id;

      // Verify catalog discovery
      const listRes = await request(app).get('/api/v1/groups?search=UAT');
      expect(listRes.status).toBe(200);
      expect(listRes.body.data.some((g) => g.id === createdGroupId)).toBe(true);

      // Verify group detail
      const detailRes = await request(app).get(`/api/v1/groups/${createdGroupId}`);
      expect(detailRes.status).toBe(200);
      expect(detailRes.body.data.memberCount).toBe(1); // Alice enrolled
    });
  });

  // ── Acceptance Scenario 3 ───────────────────────────────────────────────────
  describe('Acceptance Scenario 3: Algorithmic Recommendation & Peer Compatibility', () => {
    it('GIVEN a second student (Bob) with aligned preferences, WHEN he requests recommendations, THEN Alice group ranks high', async () => {
      // Register Bob
      const regBob = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Bob Builder',
          email: 'bob.uat@university.edu',
          password: 'Password123!',
        });
      expect(regBob.status).toBe(201);
      bobToken = regBob.body.data.token;
      bobUser = regBob.body.data.user;

      // Bob's profile
      await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${bobToken}`)
        .send({
          major: 'Computer Science',
          academicYear: 'Junior',
          learningGoals: ['exam-prep'],
          preferredSubjects: [testSubject.code],
        });

      await request(app)
        .put('/api/v1/users/availability')
        .set('Authorization', `Bearer ${bobToken}`)
        .send({
          availability: [{ dayOfWeek: 'monday', startTime: '15:00', endTime: '17:00' }],
        });

      // Fetch recommendations
      const recRes = await request(app)
        .get('/api/v1/recommendations/groups')
        .set('Authorization', `Bearer ${bobToken}`);

      expect(recRes.status).toBe(200);
      const targetGroup = recRes.body.data.find((g) => g.groupId === createdGroupId);
      expect(targetGroup).toBeDefined();
      expect(targetGroup.compatibilityScore).toBeGreaterThanOrEqual(75);
      expect(targetGroup.matchLabel).toMatch(/Compatibility/);
      expect(targetGroup.matchedCriteria.length).toBeGreaterThan(0);
    });
  });

  // ── Acceptance Scenario 4 ───────────────────────────────────────────────────
  describe('Acceptance Scenario 4: Collaborative Membership Lifecycle', () => {
    it('GIVEN Bob views Alice group, WHEN he submits a join request with a note, THEN status is pending', async () => {
      const joinRes = await request(app)
        .post(`/api/v1/groups/${createdGroupId}/join`)
        .set('Authorization', `Bearer ${bobToken}`)
        .send({
          requestNote: 'Hi Alice! Taking CS301 this term and would love to collaborate.',
        });

      expect(joinRes.status).toBe(201);
      expect(joinRes.body.data.status).toBe('pending');
      expect(joinRes.body.data.request_note).toContain('Hi Alice');
    });

    it('GIVEN Alice checks her dashboard, WHEN she retrieves pending requests, THEN Bob details are visible', async () => {
      const reqListRes = await request(app)
        .get(`/api/v1/groups/${createdGroupId}/requests`)
        .set('Authorization', `Bearer ${aliceToken}`);

      expect(reqListRes.status).toBe(200);
      expect(reqListRes.body.data.length).toBe(1);
      const applicant = reqListRes.body.data[0];
      expect(applicant.user_id).toBe(bobUser.id);
      expect(applicant.user.fullName).toBe('Bob Builder');
      expect(applicant.user.major).toBe('Computer Science');
    });

    it('GIVEN Alice reviews Bob request, WHEN she approves it, THEN Bob is accepted and roster count becomes 2', async () => {
      const approveRes = await request(app)
        .patch(`/api/v1/groups/${createdGroupId}/requests/${bobUser.id}`)
        .set('Authorization', `Bearer ${aliceToken}`)
        .send({ status: 'accepted' });

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.data.status).toBe('accepted');

      // Verify member count updated
      const detailRes = await request(app).get(`/api/v1/groups/${createdGroupId}`);
      expect(detailRes.body.data.memberCount).toBe(2);

      // Verify Bob appears in members list
      const membersRes = await request(app)
        .get(`/api/v1/groups/${createdGroupId}/members`)
        .set('Authorization', `Bearer ${aliceToken}`);
      expect(membersRes.status).toBe(200);
      expect(membersRes.body.data.some((m) => m.user_id === bobUser.id)).toBe(true);
    });
  });

  // ── Acceptance Scenario 5 ───────────────────────────────────────────────────
  describe('Acceptance Scenario 5: Capacity Invariant & Role-Based Security Enforcement', () => {
    it('GIVEN the group is at max capacity (2/2), WHEN Charlie requests to join, THEN system rejects with HTTP 400', async () => {
      const regCharlie = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Charlie Brown',
          email: 'charlie.uat@university.edu',
          password: 'Password123!',
        });
      charlieToken = regCharlie.body.data.token;

      const fullJoinRes = await request(app)
        .post(`/api/v1/groups/${createdGroupId}/join`)
        .set('Authorization', `Bearer ${charlieToken}`)
        .send({ requestNote: 'Can I join please?' });

      expect(fullJoinRes.status).toBe(400);
      expect(fullJoinRes.body.success).toBe(false);
      expect(fullJoinRes.body.message).toContain('capacity');
    });

    it('GIVEN Charlie is not the group owner, WHEN he tries to access pending requests, THEN access is forbidden (403)', async () => {
      const forbiddenRes = await request(app)
        .get(`/api/v1/groups/${createdGroupId}/requests`)
        .set('Authorization', `Bearer ${charlieToken}`);

      expect(forbiddenRes.status).toBe(403);
      expect(forbiddenRes.body.success).toBe(false);
      expect(forbiddenRes.body.message).toContain('group owner');
    });
  });
});
