/**
 * StudySync REST API — Express Application
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * Bootstraps the Express middleware pipeline and mounts API routes.
 * Uses in-memory data store (src/config/db.js) for frictionless local dev.
 *
 * Architectural route structure:
 *   POST /api/v1/auth/register
 *   POST /api/v1/auth/login
 *   GET  /api/v1/auth/me
 *   GET  /api/v1/subjects
 *   GET  /api/v1/groups
 *   POST /api/v1/groups
 *   GET  /api/v1/groups/:id
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes  from './routes/auth.routes.js';
import groupRoutes from './routes/group.routes.js';
import { sendError } from './utils/response.js';

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json({ success: true, message: 'StudySync API is running.', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use(`${API_PREFIX}/auth`,     authRoutes);
app.use(`${API_PREFIX}/groups`,   groupRoutes);
app.use(`${API_PREFIX}/subjects`, (req, res, next) => {
  // Delegate subject listing from /api/v1/subjects to group router handler
  req.url = '/subjects';
  groupRoutes(req, res, next);
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  sendError(res, 'Route not found.', 404);
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  sendError(res, 'An unexpected server error occurred.', 500);
});

// ── Start Server (not during test) ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🚀 StudySync API running at http://localhost:${PORT}${API_PREFIX}`);
    console.log(`   Health: http://localhost:${PORT}${API_PREFIX}/health\n`);
  });
}

export default app;
