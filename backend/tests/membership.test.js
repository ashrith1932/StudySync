/**
 * Integration Test Suite — Study Group Membership & Owner Approval Workflow
 * Member 2 / Member 4 — Sprint 2
 *
 * Covers:
 *   [TC-009]   POST  /api/v1/groups/:id/join
 *   [TC-010]   GET   /api/v1/groups/:id/requests
 *   [TC-010]   PATCH /api/v1/groups/:id/requests/:userId
 *   [TC-010-B] Capacity boundary guard
 *   [TC-010-C] Authorization security guard (non-owner blocked)
 *   [TC-USER]  PUT   /api/v1/users/profile & /api/v1/users/availability
 */

import request from 'supertest';
import app from '../src/app.js';
import { db } from '../src/config/db.js';

describe('Sprint 2 Membership & Profile Integration Tests', () => {
  let ownerToken;
  let ownerUser;
  let applicantToken;
  let applicantUser;
  let thirdPartyToken;
  let testGroup;
  let fullGroup;

  beforeAll(async () => {
    // 1. Register Owner (Student A)
    const ownerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Alice Owner',
        email: 'alice.owner@university.edu',
        password: 'Password123!',
      });
    expect(ownerRes.status).toBe(201);
    ownerToken = ownerRes.body.data.token;
    ownerUser = ownerRes.body.data.user;

    // 2. Register Applicant (Student B)
    const applicantRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Bob Applicant',
        email: 'bob.applicant@university.edu',
        password: 'Password123!',
      });
    expect(applicantRes.status).toBe(201);
    applicantToken = applicantRes.body.data.token;
    applicantUser = applicantRes.body.data.user;

    // 3. Register Third Party (Student C)
    const thirdRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Charlie Thirdparty',
        email: 'charlie.third@university.edu',
        password: 'Password123!',
      });
    expect(thirdRes.status).toBe(201);
    thirdPartyToken = thirdRes.body.data.token;

    // 4. Create Standard Study Group (capacity 5)
    const subject = db.subjects[0];
    const groupRes = await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Algorithms Mastermind Group',
        description: 'Comprehensive study of divide & conquer, dynamic programming.',
        subjectId: subject.id,
        maxMembers: 5,
        visibility: 'public',
        tags: ['Algorithms', 'LeetCode'],
      });
    expect(groupRes.status).toBe(201);
    testGroup = groupRes.body.data;

    // 5. Create Small Group (capacity 2: 1 owner + 1 slot)
    const fullRes = await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Duo Exclusive Circle',
        description: 'Pair study group strictly limited to two total members.',
        subjectId: subject.id,
        maxMembers: 2,
        visibility: 'public',
        tags: ['Exclusive'],
      });
    expect(fullRes.status).toBe(201);
    fullGroup = fullRes.body.data;
  });

  describe('User Profile & Availability Management (US-03)', () => {
    it('should update user profile via PUT /api/v1/users/profile', async () => {
      const res = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({
          major: 'Computer Science',
          academicYear: '3rd Year',
          bio: 'Algorithms enthusiast',
          learningGoals: ['Master DP', 'Ace Mid-Semester'],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.major).toBe('Computer Science');
      expect(res.body.data.academic_year).toBe('3rd Year');
    });

    it('should update user weekly availability via PUT /api/v1/users/availability', async () => {
      const res = await request(app)
        .put('/api/v1/users/availability')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({
          availability: [
            { dayOfWeek: 'monday', startTime: '14:00', endTime: '16:00' },
            { dayOfWeek: 'wednesday', startTime: '10:00', endTime: '12:00' },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.availability).toHaveLength(2);
    });

    it('should reject malformed availability times with 422', async () => {
      const res = await request(app)
        .put('/api/v1/users/availability')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({
          availability: [{ dayOfWeek: 'monday', startTime: '25:00', endTime: '16:00' }],
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Join Request Workflow [TC-009] (US-05)', () => {
    it('should allow Student B to submit a pending join request with note', async () => {
      const res = await request(app)
        .post(`/api/v1/groups/${testGroup.id}/join`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ requestNote: 'Hi Alice, I would like to join your algorithms prep.' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('pending');
      expect(res.body.data.group_id).toBe(testGroup.id);
      expect(res.body.data.user_id).toBe(applicantUser.id);
    });

    it('should reject duplicate join request with 409 Conflict', async () => {
      const res = await request(app)
        .post(`/api/v1/groups/${testGroup.id}/join`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ requestNote: 'Trying to request again.' });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already have a pending join request/i);
    });

    it('should reject group creator attempting to self-join with 400 Bad Request', async () => {
      const res = await request(app)
        .post(`/api/v1/groups/${testGroup.id}/join`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ requestNote: 'Owner attempting to join own group.' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already the owner/i);
    });

    it('should reject join request without authentication with 401 Unauthorized', async () => {
      const res = await request(app)
        .post(`/api/v1/groups/${testGroup.id}/join`)
        .send({ requestNote: 'No token' });

      expect(res.status).toBe(401);
    });
  });

  describe('Owner Review & Approval Workflow [TC-010, TC-010-C] (US-06)', () => {
    it('should allow owner to view pending requests with hydrated student details', async () => {
      const res = await request(app)
        .get(`/api/v1/groups/${testGroup.id}/requests`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);

      const applicantItem = res.body.data.find((r) => r.user_id === applicantUser.id);
      expect(applicantItem).toBeDefined();
      expect(applicantItem.user.fullName).toBe('Bob Applicant');
      expect(applicantItem.user.major).toBe('Computer Science');
    });

    it('[TC-010-C] should block non-owner (Student C) from viewing pending requests with 403 Forbidden', async () => {
      const res = await request(app)
        .get(`/api/v1/groups/${testGroup.id}/requests`)
        .set('Authorization', `Bearer ${thirdPartyToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Only the group owner/i);
    });

    it('should allow owner to approve pending request and increment member count', async () => {
      const res = await request(app)
        .patch(`/api/v1/groups/${testGroup.id}/requests/${applicantUser.id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'accepted' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('accepted');
      expect(res.body.data.currentMemberCount).toBe(2); // Owner + Bob
    });

    it('should show Bob in the accepted members list via GET /api/v1/groups/:id/members', async () => {
      const res = await request(app)
        .get(`/api/v1/groups/${testGroup.id}/members`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('Capacity Boundary Guard [TC-010-B] (US-06)', () => {
    it('should fill fullGroup (capacity 2) by accepting Bob', async () => {
      // Bob requests fullGroup
      const joinRes = await request(app)
        .post(`/api/v1/groups/${fullGroup.id}/join`)
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ requestNote: 'Joining fullGroup' });
      expect(joinRes.status).toBe(201);

      // Owner accepts Bob -> fullGroup now has 2/2 members
      const approveRes = await request(app)
        .patch(`/api/v1/groups/${fullGroup.id}/requests/${applicantUser.id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'accepted' });
      expect(approveRes.status).toBe(200);
      expect(approveRes.body.data.currentMemberCount).toBe(2);
    });

    it('[TC-010-B] should reject new join requests to fullGroup with 400 Bad Request', async () => {
      // Student C attempts to join fullGroup (which is at 2/2 capacity)
      const res = await request(app)
        .post(`/api/v1/groups/${fullGroup.id}/join`)
        .set('Authorization', `Bearer ${thirdPartyToken}`)
        .send({ requestNote: 'Trying to get into full group' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/maximum capacity/i);
    });
  });
});
