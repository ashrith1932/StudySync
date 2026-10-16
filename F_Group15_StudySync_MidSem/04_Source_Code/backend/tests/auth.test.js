/**
 * Auth API Integration Tests — TC-AUTH-01, TC-AUTH-02, TC-AUTH-03
 * Member 4 (Scheduling & QA) — Sprint 1
 *
 * Tests the full HTTP request/response cycle using supertest.
 * Covers: registration, duplicate email rejection, login (valid/invalid),
 * JWT issuance, and authenticated /me endpoint.
 */

import request from 'supertest';
import app from '../src/app.js';

const VALID_USER = {
  fullName: 'Rahul Sharma',
  email: 'rahul.sharma@university.ac.in',
  password: 'SecurePass123!',
};

describe('[TC-AUTH-01] POST /api/v1/auth/register', () => {
  it('should register a new user and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(VALID_USER)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user.email).toBe(VALID_USER.email);
    expect(res.body.data.user).not.toHaveProperty('password_hash');
  });

  it('should reject duplicate email with 409 Conflict', async () => {
    // First registration
    await request(app).post('/api/v1/auth/register').send(VALID_USER);

    // Duplicate attempt
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(VALID_USER)
      .expect(409);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should reject missing email with 422 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ fullName: 'Test User', password: 'pass1234' })
      .expect(422);

    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject short password (< 8 chars) with 422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ fullName: 'Test', email: 'test2@uni.ac.in', password: 'short' })
      .expect(422);

    expect(res.body.success).toBe(false);
  });
});

describe('[TC-AUTH-02] POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    // Seed: register user before each login test
    await request(app).post('/api/v1/auth/register').send({
      fullName: 'Priya Patel',
      email: 'priya.patel@university.ac.in',
      password: 'MyPassword99!',
    });
  });

  it('should login with valid credentials and return a JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'priya.patel@university.ac.in', password: 'MyPassword99!' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe('priya.patel@university.ac.in');
  });

  it('should reject wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'priya.patel@university.ac.in', password: 'WrongPassword!' })
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  it('should reject non-existent email with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@university.ac.in', password: 'SomePass123!' })
      .expect(401);

    expect(res.body.success).toBe(false);
  });
});

describe('[TC-AUTH-03] GET /api/v1/auth/me', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Amit Joshi',
      email: `amit.joshi.${Date.now()}@university.ac.in`,
      password: 'StrongPass2024!',
    });
    token = res.body.data.token;
  });

  it('should return authenticated user profile with a valid JWT', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('profile');
  });

  it('should reject request without token with 401', async () => {
    const res = await request(app).get('/api/v1/auth/me').expect(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject request with invalid token with 401', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer thisIsNotAValidToken')
      .expect(401);

    expect(res.body.success).toBe(false);
  });
});
