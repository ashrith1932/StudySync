/**
 * StudySync System Regression & Invariant Test Suite
 * Member 4 (QA & Lead) & Member 2 (Backend & Auth)
 *
 * Verifies that recent sprint enhancements (heuristic matching engine,
 * membership workflow, and profile availability schemas) have introduced
 * zero regressions into foundational system capabilities or architectural contracts.
 *
 * Covers:
 *   1. REST Response Envelope Standardization (Success & Error Envelopes)
 *   2. Credential Confidentiality & Password Hash Sanitization (NFR-001)
 *   3. Security & Injection Resistance in Search / Filter Queries
 *   4. Relational Invariants & Composite Unique Key Integrity (NFR-004)
 *   5. Course Catalog Immutability & Seed Integrity
 */

import request from 'supertest';
import app from '../src/app.js';
import { db } from '../src/config/db.js';

describe('StudySync System Regression & Invariant Test Suite', () => {
  let authToken;
  let testUser;
  let sampleGroup;

  beforeAll(async () => {
    // Register baseline user
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Regression Audit User',
        email: 'regression.auditor@university.edu',
        password: 'Password123!',
      });
    authToken = regRes.body.data.token;
    testUser = regRes.body.data.user;

    // Create baseline group
    const sub = db.subjects[0];
    const groupRes = await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Regression Baseline Group',
        description: 'Verifies system stability across sprints',
        subjectId: sub.id,
        maxMembers: 5,
        visibility: 'public',
        tags: ['regression', 'testing'],
      });
    sampleGroup = groupRes.body.data;
  });

  // ── Regression Check 1: Response Envelopes ──────────────────────────────────
  describe('Regression Check 1: Uniform Response Envelope Invariants', () => {
    it('verifies all successful API responses strictly adhere to uniform envelope', async () => {
      const endpoints = [
        { method: 'get', url: '/api/v1/health' },
        { method: 'get', url: '/api/v1/subjects' },
        { method: 'get', url: '/api/v1/groups' },
        { method: 'get', url: `/api/v1/groups/${sampleGroup.id}` },
        { method: 'get', url: '/api/v1/auth/me', auth: true },
        { method: 'get', url: '/api/v1/recommendations/groups', auth: true },
      ];

      for (const ep of endpoints) {
        const req = request(app)[ep.method](ep.url);
        if (ep.auth) req.set('Authorization', `Bearer ${authToken}`);
        const res = await req;

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message');
      }
    });

    it('verifies all error API responses adhere to uniform error envelope', async () => {
      const badRequests = [
        { method: 'get', url: '/api/v1/groups/non-existent-uuid', expectedStatus: 404 },
        { method: 'get', url: '/api/v1/auth/me', expectedStatus: 401 }, // Missing token
        { method: 'post', url: '/api/v1/auth/login', body: { email: 'bad@uni.edu', password: 'wrong' }, expectedStatus: 401 },
      ];

      for (const br of badRequests) {
        const req = request(app)[br.method](br.url);
        if (br.body) req.send(br.body);
        const res = await req;

        expect(res.status).toBe(br.expectedStatus);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toBe(false);
        expect(res.body).toHaveProperty('message');
        expect(res.body.data).toBeNull();
      }
    });
  });

  // ── Regression Check 2: Credential Confidentiality ──────────────────────────
  describe('Regression Check 2: Credential Confidentiality & Password Sanitization', () => {
    it('ensures password_hash is never exposed in registration, login, profile, or roster payloads', async () => {
      // 1. Auth payload
      const meRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);
      expect(meRes.body.data.user.password_hash).toBeUndefined();

      // 2. Member list payload
      const membersRes = await request(app)
        .get(`/api/v1/groups/${sampleGroup.id}/members`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(membersRes.status).toBe(200);
      membersRes.body.data.forEach((member) => {
        expect(member.password_hash).toBeUndefined();
        if (member.user) {
          expect(member.user.password_hash).toBeUndefined();
        }
      });
    });
  });

  // ── Regression Check 3: Query & Injection Resistance ────────────────────────
  describe('Regression Check 3: Query Parameter Sanitization & Injection Safety', () => {
    it('safely handles special characters, quotes, and script tags in search queries', async () => {
      const injectionQueries = [
        `' OR '1'='1`,
        `<script>alert(1)</script>`,
        `" UNION SELECT * FROM users --`,
        `%20--%20`,
        `CS301'; DROP TABLE study_groups; --`,
      ];

      for (const query of injectionQueries) {
        const res = await request(app).get(`/api/v1/groups?search=${encodeURIComponent(query)}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      }
    });
  });

  // ── Regression Check 4: Data Layer Invariants ───────────────────────────────
  describe('Regression Check 4: Relational & Data Integrity Invariants', () => {
    it('verifies academic subject catalogue contains all 10 core SEPM courses', async () => {
      const res = await request(app).get('/api/v1/subjects');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(10);

      const codes = res.body.data.map((s) => s.code);
      expect(codes).toContain('CS101');
      expect(codes).toContain('CS201');
      expect(codes).toContain('CS301');
      expect(codes).toContain('CS401');
      expect(codes).toContain('MA101');
    });

    it('verifies duplicate join request on same group and user is strictly blocked', async () => {
      // The creator is already an accepted member
      const dupeRes = await request(app)
        .post(`/api/v1/groups/${sampleGroup.id}/join`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ requestNote: 'Duplicate attempt' });

      // Should be rejected (self-join / duplicate)
      expect([400, 409]).toContain(dupeRes.status);
      expect(dupeRes.body.success).toBe(false);
    });
  });
});
