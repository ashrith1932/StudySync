/**
 * Study Groups API Integration Tests — TC-GROUP-01, TC-GROUP-02
 * Member 4 (Scheduling & QA) — Sprint 1
 *
 * Tests CRUD on /api/v1/groups:
 *   - Browse public groups
 *   - Create group (authenticated)
 *   - Get group by ID
 *   - Auth guard on create
 */

import request from 'supertest';
import app from '../src/app.js';

let authToken;
let subjectId;

beforeAll(async () => {
  // Register a user and get token
  const reg = await request(app).post('/api/v1/auth/register').send({
    fullName: 'Sunita Rao',
    email: `sunita.rao.${Date.now()}@university.ac.in`,
    password: 'TestPassword123!',
  });
  authToken = reg.body.data.token;

  // Fetch a subject to use in group creation
  const subs = await request(app).get('/api/v1/subjects');
  subjectId = subs.body.data[0].id;
});

describe('[TC-GROUP-01] GET /api/v1/groups', () => {
  it('should return a list of study groups', async () => {
    const res = await request(app).get('/api/v1/groups').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return subject list from /api/v1/subjects', async () => {
    const res = await request(app).get('/api/v1/subjects').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('code');
    expect(res.body.data[0]).toHaveProperty('name');
  });
});

describe('[TC-GROUP-02] POST /api/v1/groups', () => {
  const groupPayload = () => ({
    name: 'DSA Masters Study Group',
    description: 'A focused group for mastering data structures and algorithms together.',
    subjectId,
    maxMembers: 6,
    visibility: 'public',
    tags: ['algorithms', 'competitive programming'],
  });

  it('should create a study group when authenticated', async () => {
    const res = await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send(groupPayload())
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe('DSA Masters Study Group');
    expect(res.body.data.memberCount).toBe(1); // creator auto-enrolled
  });

  it('should reject group creation without auth token (401)', async () => {
    const res = await request(app)
      .post('/api/v1/groups')
      .send(groupPayload())
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it('should reject invalid subjectId with 422', async () => {
    const res = await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ ...groupPayload(), subjectId: '00000000-0000-0000-0000-000000000000' })
      .expect(422);

    expect(res.body.success).toBe(false);
  });

  it('should reject group with missing description (422)', async () => {
    const bad = groupPayload();
    delete bad.description;
    const res = await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bad)
      .expect(422);

    expect(res.body.success).toBe(false);
  });

  it('should return group detail via GET /api/v1/groups/:id', async () => {
    // Create a group first
    const create = await request(app)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send(groupPayload());

    const groupId = create.body.data.id;
    const res = await request(app).get(`/api/v1/groups/${groupId}`).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(groupId);
    expect(Array.isArray(res.body.data.members)).toBe(true);
  });
});
