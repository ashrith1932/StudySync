# Implementation Prompt for Member 3: Database & Peer Matching Specialist

**Role:** Member 3 — Database Architect & Matching Engine Specialist  
**Assigned Scope:** PostgreSQL Schema, 3NF Normalization, Referential Integrity, Migrations, Seed Data, Data Dictionary, Study Groups Subsystem, Explainable Peer/Group Matching Algorithm.  
**Branch Prefix:** `feature/database-matching-*`  
**Target Milestone:** Increments 1, 2, 3, 4 (Phased by Sprint)  

---

## 1. Context & Operational Constraints
You are responsible for the persistence tier and matching intelligence for **StudySync**.
Before writing or modifying any code, you MUST:
1. Inspect the authoritative shared documents:
   - Initial DDL Migration: `database/migrations/001_initial_schema.sql`
   - Data Dictionary: `docs/database/DATA_DICTIONARY.md`
   - ER Diagram: `docs/diagrams/er_diagram.mermaid`
   - API Specification: `docs/api/API_SPECIFICATION.md`
   - Master Project Plan: `docs/PROJECT_PLAN.md`
2. **STRICT PROHIBITION:** You are the SOLE owner of database migrations. Any schema modification must be introduced via a new numbered SQL script in `database/migrations/`. You MUST NOT modify existing applied migrations directly. You must preserve Third Normal Form (3NF) and referential integrity constraints.

---

## 2. Permitted Working Directory
- You work strictly within `database/`, backend database repositories, matching services, and documentation in `docs/`.
- Permitted files to create/edit:
  - `database/migrations/*` (DDL scripts: `001_initial_schema.sql`, `002_...`)
  - `database/seeds/*` (Test seed data: `001_sample_seed.sql`)
  - `database/schema/*` & `docs/database/*` (Data dictionary, indexing plans)
  - `backend/src/config/db.js` (PostgreSQL `pg.Pool` connection manager)
  - `backend/src/repositories/userRepository.js`, `groupRepository.js`
  - `backend/src/services/groupService.js`, `matchingService.js`
  - `backend/src/controllers/groupController.js`, `matchingController.js`
  - `backend/tests/matching.test.js`, `backend/tests/groups.test.js`

---

## 3. Detailed Deliverables by Sprint

### Sprint 1 Deliverables (Database Engine & Group Scaffolding)
- [ ] Implement database connection pool in `backend/src/config/db.js` using `pg.Pool`.
- [ ] Verify that `database/migrations/001_initial_schema.sql` runs cleanly on an empty PostgreSQL database.
- [ ] Verify sample seed data in `database/seeds/001_sample_seed.sql`.
- [ ] Implement `groupRepository.js` with methods: `create`, `findById`, `findAllWithFilters` (subject, keyword, pagination), `updateMemberCount`.
- [ ] Implement `groupService.js` and `groupController.js` for:
  - `POST /api/v1/groups` (with automatic owner membership insertion)
  - `GET /api/v1/groups` (with pagination, search, and subject filtering)
  - `GET /api/v1/groups/:id`

### Sprint 2 Deliverables (Membership Workflow & Heuristic Matching Engine)
- [ ] Implement Group Membership repository and endpoints:
  - `POST /api/v1/groups/:id/join` (checks `current_member_count < max_members`, inserts `pending` status)
  - `GET /api/v1/groups/:id/members`
  - `PATCH /api/v1/groups/:id/members/:userId` (updates status to `accepted`, triggers transaction to increment member count)
- [ ] Implement the **Heuristic Compatibility Matching Algorithm** in `backend/src/services/matchingService.js`:
  $$\text{Score} = (W_{\text{subj}} \times S_{\text{subj}}) + (W_{\text{time}} \times S_{\text{time}}) + (W_{\text{goal}} \times S_{\text{goal}})$$
  - Subject Weight ($W_{\text{subj}} = 40\%$): 100% if exact course match; 50% if same department; 0% otherwise.
  - Schedule Weight ($W_{\text{time}} = 40\%$): Ratio of overlapping available hours per week between student and group session windows.
  - Learning Goal Weight ($W_{\text{goal}} = 20\%$): Jaccard similarity or keyword overlap between student goals and group tags/description.
- [ ] Implement endpoint `GET /api/v1/groups/recommendations` returning ranked matches with score breakdown.
- [ ] Write unit tests for matching formula edge cases (disjoint schedules, identical profiles, empty goals).

### Sprint 3 Deliverables (Query Optimization & Relational Integrity)
- [ ] Audit query execution plans using `EXPLAIN ANALYZE` on search and recommendation queries.
- [ ] Ensure GIN indexes on `user_profiles.availability` and B-Tree indexes on foreign keys are actively utilized.
- [ ] Support Member 4 by providing optimized relational queries for session calendar lookups and attendee rosters.

### Sprint 4 Deliverables (Performance & Audit)
- [ ] Execute stress/load test on `/api/v1/groups` with 50 concurrent requests (`TC-018`); ensure response $< 200\text{ms}$.
- [ ] Verify cascading deletes: deleting a group removes child memberships, sessions, and resources cleanly with zero orphan rows (`TC-020`).
- [ ] Finalize Database Design section in Mid-Sem Report and final project documentation.

---

## 4. Database & Repository Standards
- **Connection Hygiene:** Always release clients back to the pool (`client.release()`) in `finally` blocks.
- **Transactions:** Use explicit `BEGIN`, `COMMIT`, and `ROLLBACK` for multi-step mutations (such as approving a member and incrementing member count).
- **Naming Conventions:** All SQL tables and columns must use lowercase `snake_case`.

---

## 5. Verification & Acceptance Criteria
- Migration executes with 0 SQL syntax errors.
- Unit tests verify the matching score yields reproducible, explainable numbers between 0 and 100.
- All test results logged in `docs/testing/TEST_CASES.md` (`TC-006`, `TC-007`, `TC-008`, `TC-009`, `TC-010`, `TC-011`, `TC-012`, `TC-018`, `TC-020`).
