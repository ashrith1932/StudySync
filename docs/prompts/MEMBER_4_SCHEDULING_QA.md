# Implementation Prompt for Member 4: Scheduling, Resources & QA Specialist

**Role:** Member 4 — Scheduling, Shared Resources & Quality Assurance Lead  
**Assigned Scope:** Study Session Scheduling, Time Boundary Validation, Overlap & Conflict Detection Heuristics, Attendance RSVP & Check-in, Shared Resources Repository, Master Test Plan, Traceability Matrix, Defect Tracking, Demo Coordination.  
**Branch Prefix:** `feature/scheduling-qa-*`  
**Target Milestone:** Increments 1, 2, 3, 4 (Phased by Sprint)  

---

## 1. Context & Operational Constraints
You are responsible for study session coordination, resource sharing, and overall software quality governance for **StudySync**.
Before writing or modifying any code, you MUST:
1. Inspect the authoritative shared documents:
   - Test Plan: `docs/testing/TEST_PLAN.md`
   - Test Cases: `docs/testing/TEST_CASES.md`
   - Traceability Matrix: `docs/requirements/TRACEABILITY_MATRIX.md`
   - API Specification: `docs/api/API_SPECIFICATION.md`
   - Master Project Plan: `docs/PROJECT_PLAN.md`
2. **STRICT PROHIBITION:** You MUST NOT introduce breaking changes to database schemas or auth token structures. You MUST verify and record real test executions rather than claiming completion without evidence.

---

## 2. Permitted Working Directory
- You work within `backend/src/` (scheduling, attendance, and resource modules), `docs/testing/`, `docs/reports/`, and project management logs in `docs/scrum/`.
- Permitted files to create/edit:
  - `backend/src/repositories/sessionRepository.js`, `resourceRepository.js`
  - `backend/src/services/schedulingService.js`, `resourceService.js`
  - `backend/src/controllers/sessionController.js`, `resourceController.js`
  - `backend/src/validators/sessionValidator.js`, `resourceValidator.js`
  - `backend/tests/scheduling.test.js`, `backend/tests/resources.test.js`
  - `docs/testing/*` (Test Plan, Test Cases, Defect Log, Evidence logs)
  - `docs/requirements/TRACEABILITY_MATRIX.md` (Update statuses as features land)
  - `docs/reports/*` (Mid-Sem Report compilation, Demo video coordination)

---

## 3. Detailed Deliverables by Sprint

### Sprint 1 Deliverables (QA Framework & Baseline Setup)
- [ ] Establish Jest testing configuration in `backend/` and Vitest in `frontend/`.
- [ ] Initialize Test Case Register (`docs/testing/TEST_CASES.md`) with baseline test cases `TC-001` through `TC-020`.
- [ ] Conduct initial verification of Member 2's Auth endpoints and Member 3's DB migrations.
- [ ] Initialize Defect Log (`docs/testing/DEFECT_LOG.md`).

### Sprint 2 Deliverables (Mid-Semester Report & Demo Coordination)
- [ ] Validate end-to-end user workflow: Student Registration $\rightarrow$ Profile $\rightarrow$ Group Creation $\rightarrow$ Second Student Join Request $\rightarrow$ Owner Approval.
- [ ] Compile Mid-Semester Project Report draft adhering strictly to the 16-point outline in `docs/reports/MIDSEM_REPORT_TEMPLATE.md`.
- [ ] Coordinate and record the 5–7 minute Demonstration Video per `docs/reports/DEMO_VIDEO_GUIDE.md`.
- [ ] Verify view-only cloud link in `DEMO_VIDEO_LINK.txt`.
- [ ] Verify Moodle submission ZIP package structure (`docs/reports/SUBMISSION_ZIP_SPEC.md`).

### Sprint 3 Deliverables (Scheduling Engine, Attendance & Resources)
- [ ] Implement `sessionRepository.js` and `sessionService.js` supporting:
  - `POST /api/v1/groups/:groupId/sessions`
  - `GET /api/v1/sessions/calendar?from=...&to=...`
  - `PATCH /api/v1/sessions/:id/rsvp` (updates RSVP status: attending, declined, tentative)
  - `POST /api/v1/sessions/:id/checkin` (validates active session time window and records timestamp)
- [ ] Implement **Session Conflict Detection Algorithm**:
  - Validates `endTime > startTime` and `startTime > NOW()`.
  - Queries overlapping intervals for enrolled members:
    $$\text{Conflict exists if: } (S_{\text{new}} < E_{\text{existing}}) \land (E_{\text{new}} > S_{\text{existing}})$$
  - Returns structured warning alert if conflicts are found.
- [ ] Implement Shared Resources endpoints:
  - `POST /api/v1/groups/:groupId/resources` (stores title, URI, type, file size)
  - `GET /api/v1/groups/:groupId/resources` (verifies requester is a group member)

### Sprint 4 Deliverables (End-to-End Regression & Final QA)
- [ ] Execute complete test suite across all 20+ test cases; log actual results and screenshots in `docs/testing/evidence/`.
- [ ] Review open defects in `docs/testing/DEFECT_LOG.md` and verify all S1/S2 bugs are resolved.
- [ ] Audit Requirements Traceability Matrix (`docs/requirements/TRACEABILITY_MATRIX.md`) to confirm 100% requirements are verified.
- [ ] Finalize final project report, user guide, and demo package.

---

## 4. Quality & Verification Standards
- **Traceability Discipline:** Every merged feature PR must cite its `FR-xxx` requirement and `TC-xxx` test case ID.
- **Defect Logging:** Any bug encountered during integration testing must be logged in `docs/testing/DEFECT_LOG.md` before fixes are committed.
- **Evidence Integrity:** Screenshots and logs must come from actual command line runs and live browser sessions.

---

## 5. Verification & Acceptance Criteria
- Unit tests for scheduling conflict heuristics pass with 100% coverage on edge cases (identical times, boundary touches, nested intervals).
- Mid-Sem Report and Demo video links verified and accessible.
- Final test cases in `docs/testing/TEST_CASES.md` updated with actual pass/fail status (`TC-013`, `TC-014`, `TC-015`, `TC-016`).
