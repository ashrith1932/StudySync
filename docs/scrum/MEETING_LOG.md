# StudySync Team Meeting Log & Weekly Progress Record

**Course:** Software Engineering & Project Management (SEPM)  
**Evaluation Requirement:** Section 3.E (Contribution & Project-Management Evidence)  

---

## Weekly Progress & Meeting Records

### Meeting 01: Project Kickoff & Requirements Analysis (Phase 0)
- **Date & Time:** October 16, 2026 | 14:00 - 15:30
- **Mode:** In-person / Hybrid
- **Attendees:** Member 1, Member 2, Member 3, Member 4 (All Present)
- **Agenda:**
  1. Detailed walkthrough of the Course Mid-Semester Evaluation PDF requirements.
  2. Scope definition, target features, and explicit exclusions for StudySync.
  3. Technology stack selection: React + TypeScript + Tailwind CSS, Node.js + Express, PostgreSQL.
  4. SDLC model alignment: Incremental Development Model organized via Scrum.
- **Key Decisions:**
  - Standardized on 3NF PostgreSQL schema with foreign keys and cascading delete rules.
  - Defined authoritative REST API response envelope `{ success, data, meta, error }`.
  - Assigned initial ownership: Member 1 (Frontend), Member 2 (Backend/Auth), Member 3 (DB/Matching), Member 4 (Scheduling/QA).
- **Action Items:**
  - Member 3 to draft initial migration and ER diagram.
  - Member 2 to scaffold Express server and Auth API contracts.
  - Member 1 to initialize Vite React structure and TypeScript definitions.
  - Member 4 to initialize SRS, Traceability Matrix, and Test Plan.

---

### Meeting 02: Environment Verification & Harness Setup (Phase 1)
- **Date & Time:** October 16, 2026 | 16:00 - 17:00
- **Mode:** Hybrid Lab Session
- **Attendees:** Member 1, Member 2, Member 3, Member 4 (All Present)
- **Agenda:**
  1. Verification of local Node.js v24+ and npm 11+ environments.
  2. Installation of root, backend, and frontend dependencies.
  3. Verification of backend Jest runner and frontend Vitest runner with baseline smoke tests.
  4. Establishment of Git branching cadence and documentation tracking guidelines.
- **Key Decisions:**
  - Automated test outputs will be preserved in `docs/testing/evidence/` for final submission packaging.
  - Test suites must be kept green at every commit.
  - Member 2 to commence Express backend auth controllers and validation middleware.
  - Member 1 to initialize frontend React UI shell and route guards.
- **Next Targets:**
  - Member 1: Build React Navbar, Hero, and Login/Register UI.
  - Member 2: Implement bcrypt hashing, JWT issuance, and registration/login route handlers.
  - Member 3: Wire database repository layer with sample course seeds.
  - Member 4: Create automated unit test suite for Auth endpoints (`TC-AUTH-01` to `TC-AUTH-03`).

### Meeting 03: Sprint 2 Review & Matching/QA Sign-off (Mid-Sem Milestone 50%)
- **Date & Time:** October 16, 2026 | 17:30 - 18:30
- **Mode:** Hybrid Lab Session
- **Attendees:** Member 1, Member 2, Member 3, Member 4 (All Present)
- **Agenda:**
  1. Review of group membership request & owner approval workflow (`US-05`, `US-06`).
  2. Verification of heuristic matching engine calculation ($W_{\text{subject}} = 0.40, W_{\text{schedule}} = 0.40, W_{\text{goals}} = 0.20$) and explainability tags (`US-07`).
  3. QA audit: Verification of 43 passed unit and integration tests (100% green rate).
  4. Inspection of evidence log `docs/testing/evidence/sprint2_test_results.txt`.
- **Key Decisions:**
  - Sprint 2 features accepted into `main` baseline; Mid-Semester 50% milestone satisfied.
  - Member 3 confirmed database referential integrity, repository joins, and matching logic.
  - Member 4 verified all test cases `TC-009` through `TC-012`, `TC-018`, and `TC-020` marked PASS.
- **Next Targets (Sprint 3 Preview):**
  - Member 4 to commence study session scheduling schema and time boundary collision guards (`US-08` - `US-10`).
  - Member 1 to design session calendar view and RSVP modals (`US-11`).
  - Member 2 & 3 to design study resource upload metadata schema (`US-12`).

---

### Meeting Template (For Weekly Sprint Coordination)


```markdown
### Meeting [Number]: [Sprint Title / Objective]
- **Date & Time:** [YYYY-MM-DD] | [HH:MM - HH:MM]
- **Mode:** [In-person / Online Meeting Link]
- **Attendees:** [List of members present]
- **Discussion Points:**
  - Progress review against Sprint Backlog.
  - Contract integration checkpoints between Frontend and Backend.
  - Demonstration of newly completed increment features.
  - Impediments or architectural blockers.
- **Decisions Made:**
  - [Decision 1]
  - [Decision 2]
- **Next Week Targets:**
  - Member 1: [Deliverable]
  - Member 2: [Deliverable]
  - Member 3: [Deliverable]
  - Member 4: [Deliverable]
```
