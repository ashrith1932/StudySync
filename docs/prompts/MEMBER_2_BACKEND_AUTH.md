# Implementation Prompt for Member 2: Backend Architecture & Authentication Specialist

**Role:** Member 2 — Backend & Security Engineer  
**Assigned Scope:** Express.js REST Architecture, Middleware Pipeline, JWT Authentication, RBAC, Password Hashing, Input Validation (Zod), Centralized Error Handling, User & Auth APIs, Backend Unit/Integration Testing.  
**Branch Prefix:** `feature/backend-auth-*`  
**Target Milestone:** Increments 1, 2, 3, 4 (Phased by Sprint)  

---

## 1. Context & Operational Constraints
You are implementing the core backend architecture and authentication subsystem for **StudySync**.
Before writing or modifying any code, you MUST:
1. Inspect the authoritative shared documents:
   - API Specification: `docs/api/API_SPECIFICATION.md`
   - System Architecture: `docs/architecture/SYSTEM_ARCHITECTURE.md`
   - Database DDL: `database/migrations/001_initial_schema.sql`
   - Data Dictionary: `docs/database/DATA_DICTIONARY.md`
   - Master Project Plan: `docs/PROJECT_PLAN.md`
2. **STRICT PROHIBITION:** You MUST NOT change API route paths, JSON envelope schemas, or database table structures without consulting Member 1 and Member 3. You MUST NEVER commit real secrets, private keys, or passwords to Git.

---

## 2. Permitted Working Directory
- You work strictly within `backend/src/`, `backend/tests/`, and documentation templates in `docs/`.
- Permitted files to create/edit:
  - `backend/src/app.js` (Express configuration, middleware mounting, route binding)
  - `backend/src/config/*` (Environment loader, JWT configuration, constants)
  - `backend/src/middleware/*` (`authMiddleware.js`, `roleMiddleware.js`, `errorMiddleware.js`, `validateMiddleware.js`)
  - `backend/src/controllers/authController.js`, `userController.js`
  - `backend/src/services/authService.js`, `userService.js`
  - `backend/src/validators/*` (Zod schemas for Auth, Profile, and Availability)
  - `backend/src/utils/*` (JWT helper, password hashing helper, API response builder)
  - `backend/tests/auth.test.js`, `backend/tests/users.test.js`

---

## 3. Detailed Deliverables by Sprint

### Sprint 1 Deliverables (Core Architecture & Auth)
- [ ] Implement Express server bootstrap in `backend/src/app.js` with CORS, JSON body parser, and security headers.
- [ ] Implement centralized error handler middleware returning `{ success: false, data: null, error: { code, message, details } }`.
- [ ] Implement standard response helper `sendSuccess(res, data, message, meta, statusCode)`.
- [ ] Implement password hashing and verification using `bcryptjs` (salt rounds: 10).
- [ ] Implement JWT token generation and verification using `jsonwebtoken` (24h lifespan).
- [ ] Implement `authMiddleware` to inspect `Authorization: Bearer <token>`, decode payload, and attach `req.user`.
- [ ] Implement Zod validators for `/api/v1/auth/register`, `/api/v1/auth/login`, and `/api/v1/users/profile`.
- [ ] Implement endpoints:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `PUT /api/v1/users/profile`
  - `PUT /api/v1/users/availability`

### Sprint 2 Deliverables (Role Authorization & Middleware Polish)
- [ ] Implement `roleMiddleware(allowedRoles)` for role-based endpoint protection.
- [ ] Collaborate with Member 3 on Group Membership authorization middleware (`isGroupOwner`, `isGroupMember`).
- [ ] Write integration test suite using Supertest verifying:
  - Registration with duplicate email returns `409 Conflict`.
  - Invalid login credentials returns `401 Unauthorized`.
  - Protected endpoints reject missing or malformed tokens.

### Sprint 3 Deliverables (Security Hardening & Integration Support)
- [ ] Assist Member 4 in binding Session and Resource routes into `app.js`.
- [ ] Implement rate-limiting middleware on auth endpoints (e.g., max 10 failed login attempts per 15 minutes).
- [ ] Audit all endpoints to ensure zero sensitive fields (`password_hash`) are ever returned in JSON responses.

### Sprint 4 Deliverables (Final QA & Audit)
- [ ] Execute security audit: Test against SQL injection strings, XSS payloads, and authorization bypass.
- [ ] Ensure all backend tests run cleanly via `npm test` with 0 unhandled promise rejections.
- [ ] Document final API status codes in `docs/api/API_SPECIFICATION.md`.

---

## 4. Coding & Security Rules
- **No Direct SQL in Controllers:** Controllers must delegate to Services. Services call Repositories.
- **Strict Parameterized Queries:** If writing repository queries, always use parameterized queries `$1, $2, ...`.
- **Environment Isolation:** Read all settings from `process.env` through a centralized `backend/src/config/index.js` file with fallback defaults for test runs.

---

## 5. Verification & Acceptance Criteria
- `npm test` runs all Supertest test suites and passes 100%.
- Passwords stored in PostgreSQL start with `$2a$10$` and are never plaintext.
- Record actual execution logs in `docs/testing/TEST_CASES.md` (`TC-001`, `TC-002`, `TC-003`, `TC-004`, `TC-017`).
- Commit messages follow `feat(auth): ...` and `test(auth): ...`.
