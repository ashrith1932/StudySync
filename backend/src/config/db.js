/**
 * StudySync In-Memory Data Store
 * Member 3 (Database & Matching) — Sprint 1
 *
 * Provides an in-memory SQLite-like store so the application runs
 * without requiring a live PostgreSQL instance during local development
 * and CI testing. Mirrors the exact relational schema defined in
 * database/migrations/001_initial_schema.sql.
 *
 * In production, swap src/config/db.js to use the pg Pool instead.
 */

import { randomUUID } from 'crypto';

// ── In-memory tables ─────────────────────────────────────────────────────────
export const db = {
  users: [],
  subjects: [],
  user_profiles: [],
  study_groups: [],
  group_memberships: [],
};

// ── Seed: Academic subject catalogue ────────────────────────────────────────
const now = new Date().toISOString();
const subjects = [
  { code: 'CS101', name: 'Introduction to Programming', department: 'Computer Science' },
  { code: 'CS201', name: 'Data Structures & Algorithms', department: 'Computer Science' },
  { code: 'CS301', name: 'Software Engineering', department: 'Computer Science' },
  { code: 'CS401', name: 'Database Management Systems', department: 'Computer Science' },
  { code: 'CS501', name: 'Machine Learning', department: 'Computer Science' },
  { code: 'MA101', name: 'Calculus I', department: 'Mathematics' },
  { code: 'MA201', name: 'Linear Algebra', department: 'Mathematics' },
  { code: 'PH101', name: 'Engineering Physics', department: 'Physics' },
  { code: 'EC201', name: 'Digital Electronics', department: 'Electronics' },
  { code: 'HU101', name: 'Technical Communication', department: 'Humanities' },
];

subjects.forEach((s) => {
  db.subjects.push({ id: randomUUID(), ...s, created_at: now });
});

// ── Generic helpers ───────────────────────────────────────────────────────────

/** Find all records matching a partial object filter */
export function findAll(table, filter = {}) {
  return db[table].filter((row) =>
    Object.entries(filter).every(([k, v]) => row[k] === v)
  );
}

/** Find one record matching a partial object filter */
export function findOne(table, filter = {}) {
  return db[table].find((row) =>
    Object.entries(filter).every(([k, v]) => row[k] === v)
  ) || null;
}

/** Insert a record and return it */
export function insert(table, data) {
  const ts = new Date().toISOString();
  const record = { id: randomUUID(), ...data, created_at: ts, updated_at: ts };
  db[table].push(record);
  return record;
}

/** Update fields on a matching record and return updated copy */
export function update(table, filter, changes) {
  const idx = db[table].findIndex((row) =>
    Object.entries(filter).every(([k, v]) => row[k] === v)
  );
  if (idx === -1) return null;
  db[table][idx] = { ...db[table][idx], ...changes, updated_at: new Date().toISOString() };
  return db[table][idx];
}
