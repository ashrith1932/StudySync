# StudySync Sprint 2 Master Plan & Work Allocation Specification

---

## 1. Sprint 2 Overview and Goal

### 1.1 Purpose of Sprint 2
Sprint 2 represents the transition of StudySync from an initial structural foundation (Sprint 1: User Authentication, Subject Catalog, Basic Group Scaffolding) into an interactive, multi-user collaborative platform. The primary purpose is to close the core collaborative loop of the platform: allowing students to request membership in study groups, enabling group owners to manage rosters through an approval workflow, calculating algorithmic compatibility recommendations between students and groups, and delivering a verified, demonstrable end-to-end user journey that satisfies the 40%–60% completion milestone of the academic project lifecycle.

### 1.2 Sprint Goal
> **"Implement the complete group membership lifecycle (request, review, approve, reject, roster update with capacity enforcement), develop the multi-variable heuristic peer-matching engine, and verify the integrated end-to-end workflow through automated test suites and traceable project management documentation."**

### 1.3 How Sprint 2 Builds Upon Sprint 1
* **Authentication $\rightarrow$ Authorization:** Sprint 1 established identity via JSON Web Tokens (`req.user`). Sprint 2 leverages this identity to establish role-based access control (Group Owner vs. Group Member vs. Applicant) across all group interaction routes.
* **Group Browsing $\rightarrow$ Group Participation:** Sprint 1 provided a read-only group directory. Sprint 2 activates the relational join between students and groups via the `group_memberships` entity.
* **Static Subjects $\rightarrow$ Algorithmic Matching:** Sprint 1 seeded static subjects. Sprint 2 correlates student profile attributes (subjects, availability, goals) against group properties using a deterministic matching heuristic.
* **Test Harness $\rightarrow$ Regression & Integration Coverage:** Sprint 1 verified Jest and Vitest harnesses with 18 baseline tests. Sprint 2 builds an end-to-end integration test suite on top of this harness covering multi-user edge cases and concurrency safeguards.

### 1.4 Acceptance Criteria & Sprint-Level Definition of Done (DoD)
A feature or task is considered complete in Sprint 2 only when all of the following criteria are fulfilled:
1. **Contract Adherence:** All HTTP endpoints and client requests strictly match the agreed REST response envelope `{ success, data, meta, message, errors }`.
2. **Relational Integrity:** All database operations execute with strict foreign key constraints, cascading delete safety, and uniqueness guards (e.g., duplicate membership attempts rejected).
3. **Capacity Invariant:** No group can exceed its configured `max_members` under any circumstance, including race conditions during approval.
4. **Role Enforcement:** Non-owners are strictly prevented from viewing pending applications or approving members (HTTP 403 Forbidden).
5. **Quality Gate:** All newly written unit, API, and UI interaction tests pass with 100% green status; zero regressions introduced to Sprint 1 tests.
6. **Documentation Synchronization:** Every new feature is mapped to a User Story ID, traceable in `TEST_CASES.md`, with architectural decisions logged in project records.
7. **Git Verification:** All work is merged into `main` via reviewed Pull Requests from isolated feature branches with zero merge conflicts.

---

## 2. Sprint 2 Scope and Feature Selection

### 2.1 Confirmed Facts vs. Working Assumptions
* **Confirmed Fact (from Project Master Plan & SRS):** The system requires user profile setup with recurring weekly availability slots (`US-03`), group membership requests with applicant notes (`US-05`), owner review dashboards with approve/reject actions (`US-06`), and algorithmic compatibility scoring (`US-07`).
* **Confirmed Fact (from Repository Audit):** Sprint 1 completed `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `GET /api/v1/subjects`, `GET /api/v1/groups`, and `POST /api/v1/groups`.
* **Working Assumption (Duration):** Sprint 2 follows a standard 2-week academic Agile cadence (10 working days / 14 calendar days) with an estimated team velocity target of 16 Story Points.

### 2.2 Features Included in Sprint 2 Scope

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SPRINT 2 SCOPE BOUNDARY                         │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 1. User Academic Profile Setup   │ • Major, Year, Goals, Availability  │
│    (US-03 / FR-004, FR-005)      │ • Relational user_profiles storage  │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 2. Membership Request Workflow   │ • Join request submission with note │
│    (US-05 / FR-008)              │ • Duplicate request prevention      │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 3. Owner Review & Roster Guard   │ • Owner pending requests dashboard  │
│    (US-06 / FR-009, FR-010)      │ • Approve/Reject action handlers    │
│                                  │ • Strict max_members capacity cap   │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 4. Heuristic Matching Engine     │ • Subject + Schedule + Goal weights │
│    (US-07 / FR-011, FR-012)      │ • Explainable score breakdown       │
│                                  │ • Ranked recommendation catalog     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 2.3 Features Deferred to Sprint 3 & Sprint 4 (Explicitly Out of Scope)
* **Study Session Scheduling (`US-08`, `US-09`, `US-10`):** Meeting creation, calendar interfaces, time boundary validators, and session collision detection are deferred to Sprint 3.
* **Attendance RSVP & Check-in (`US-11`):** Check-in timestamps and attendance accountability are deferred to Sprint 3.
* **Resource Sharing (`US-12`):** File uploads, document metadata, and resource repository drawers are deferred to Sprint 3.
* **Production Security Hardening & Rate Limiting (`US-13`, `US-14`):** Production rate limiters, token refresh rotations, and browser stress testing are deferred to Sprint 4.

---

## 3. Member 1: Detailed Execution Plan
**Role:** Frontend & UI/UX Specialist  
**Assigned User Stories:** `US-03` (Profile Setup), `US-05` (Group Detail & Join Request), `US-06` (Owner Request Review), `US-07` (Recommendations View)  
**Assigned Git Branch:** `feat/frontend-membership-matching`

### 3.1 Step-by-Step Execution Sequence
1. **Step 1.1 — Profile Setup & Availability Interface (`US-03`):**  
   Create the dedicated profile management interface (`ProfilePage.tsx`). Implement form controls for student major, academic year, and learning goals. Build an interactive weekly availability selector allowing students to toggle recurring morning, afternoon, and evening availability slots across Monday through Sunday.
2. **Step 1.2 — Service Layer Expansion (`group.service.ts`):**  
   Extend the client API service to define typed methods for:
   * `requestToJoinGroup(groupId: string, note: string)`
   * `getPendingRequests(groupId: string)`
   * `respondToJoinRequest(groupId: string, userId: string, action: 'accepted' | 'rejected')`
   * `getRecommendedGroups()`
   * `updateProfile(profileData: UserProfile)`
3. **Step 1.3 — Comprehensive Group Detail View (`GroupDetailPage.tsx`):**  
   Implement the group detail screen displaying group title, description, course badge, tags, max capacity counter, and current roster. Add conditional state rendering:
   * *Non-Member View:* Display prominent "Request to Join" button.
   * *Pending Applicant View:* Display "Application Under Review" status badge.
   * *Enrolled Member View:* Display "Active Member" badge and group roster.
   * *Owner View:* Display group management controls and pending request alert counter.
4. **Step 1.4 — Request to Join Modal Component (`JoinRequestModal.tsx`):**  
   Implement a clean modal overlay allowing students to draft an introduction note (max 500 characters) explaining their academic goals and weekly availability before submitting their join request. Include real-time character counter and error handling.
5. **Step 1.5 — Owner Review & Roster Dashboard (`OwnerReviewPanel.tsx`):**  
   Build an administrative panel for group creators embedded inside the Group Detail view. Display a table of pending applicant cards showing student full name, email, academic major, application note, and submission timestamp. Attach distinct "Approve" (green) and "Decline" (gray/red) action triggers.
6. **Step 1.6 — Algorithmic Recommendations Catalog (`RecommendationsPage.tsx`):**  
   Create a recommendation hub rendering algorithmically suggested study groups. Each recommendation card must display an overall compatibility percentage badge (e.g., "88% Match"), color-coded visual indicator, and an explainable breakdown tag container (e.g., "Matches CS301", "Overlapping Tuesday afternoon slots").
7. **Step 1.7 — Client-Side Router & Navigation Wiring:**  
   Mount `/profile`, `/groups/:id`, and `/recommendations` into `App.tsx` protected route hierarchies. Add an active "Recommendations" link with badge indicators to `Navbar.tsx`.

### 3.2 Dependencies & Handoffs
* **Prerequisites:** Requires Member 2's API contracts and mock endpoints for `/join`, `/requests`, and `/recommendations` to finalize state binding.
* **Coordination Point:** Must agree with Member 3 on the exact JSON representation of weekly availability slots (`DayTimeSlot[]`) to ensure frontend selections serialize identically to the database schema.

### 3.3 Deliverables & Acceptance Criteria
* **Deliverable D1.1:** Operational `ProfilePage` persisting major and availability slots.
* **Deliverable D1.2:** Operational `GroupDetailPage` handling public, pending, member, and owner UI states.
* **Deliverable D1.3:** Operational `JoinRequestModal` and `OwnerReviewPanel` with live optimistic UI state updates upon approval/rejection.
* **Deliverable D1.4:** Operational `RecommendationsPage` rendering compatibility badges and criteria tags.
* **Acceptance Criteria:** Zero horizontal layout overflow down to 360px viewport; form validation feedback displayed on invalid submissions; owner approval immediately reflects in the displayed roster count without requiring a manual page refresh.

### 3.4 Testing Responsibilities
* Implement frontend unit tests (`frontend/tests/MembershipFlow.test.tsx` and `ProfileForm.test.tsx`) using Vitest and React Testing Library.
* Verify form input constraints (e.g., note length, missing fields).
* Verify conditional rendering of owner controls vs. applicant controls based on authenticated user ID.

---

## 4. Member 2: Detailed Execution Plan
**Role:** Backend & Authentication Specialist  
**Assigned User Stories:** `US-05` (Join Request API), `US-06` (Membership Review & Approval API), `US-03` (Profile Setup API)  
**Assigned Git Branch:** `feat/backend-membership-matching`

### 4.1 Step-by-Step Execution Sequence
1. **Step 2.1 — Membership Zod Schema Validation (`membership.validator.js`):**  
   Define and export Zod validation schemas enforcing strict payload shapes:
   * `joinRequestSchema`: Body containing optional `requestNote` (string, max 500 characters, trimmed).
   * `membershipActionSchema`: Body containing mandatory `status` enum restricted strictly to `['accepted', 'rejected']`.
   * `profileUpdateSchema`: Body containing `major`, `academicYear`, `learningGoals` (string array), and `availability` (array of valid time-slot objects).
2. **Step 2.2 — Membership Route Definition (`group.routes.js`):**  
   Define RESTful route signatures under the `/api/v1/groups` hierarchy:
   * `POST /:id/join` $\rightarrow$ Authenticated route guarded by `protect` and `validate(joinRequestSchema)`.
   * `GET /:id/requests` $\rightarrow$ Authenticated route returning pending applicants for the specified group.
   * `PATCH /:id/requests/:userId` $\rightarrow$ Authenticated route processing owner approval or rejection.
   * `GET /user/my-memberships` $\rightarrow$ Authenticated route returning all group memberships for the caller.
3. **Step 2.3 — Membership Controller Logic (`membership.controller.js`):**  
   Implement core business logic enforcing domain invariants:
   * *Self-Join Prevention:* Verify caller is not the group creator (`group.creator_id !== req.user.id`). Reject with HTTP 400 Bad Request if self-joining.
   * *Duplicate Request Guard:* Query existing membership records for `(group_id, user_id)`. Reject with HTTP 409 Conflict if status is already `pending` or `accepted`.
   * *Capacity Boundary Check on Join:* Verify current accepted member count is strictly less than `group.max_members`. Reject with HTTP 400 Bad Request if full.
4. **Step 2.4 — Authorization & Owner Approval Workflow:**  
   * In `getPendingRequests`, verify `group.creator_id === req.user.id`. Reject unauthorized callers with HTTP 403 Forbidden.
   * In `respondToRequest`, verify group ownership. If action is `accepted`, perform a strict check against `max_members`. Update membership status to `accepted`, set `joined_at = NOW()`, and return updated record.
5. **Step 2.5 — Profile Controller Implementation (`user.controller.js`):**  
   Implement `PUT /api/v1/users/profile` allowing students to update their academic major, goals, and availability array. Ensure caller can only modify their own profile record.
6. **Step 2.6 — Centralized Router Mounting (`app.js`):**  
   Ensure all newly developed routes are mounted cleanly under `/api/v1/groups` and `/api/v1/users` with error-handling middleware catching all unhandled promise rejections.

### 4.2 Dependencies & Handoffs
* **Prerequisites:** Requires Member 3's updated repository methods (`membershipRepository.findByGroupAndUser`, `memberCount`, `findWithUserDetails`) to query and persist membership state.
* **Coordination Point:** Supplies authoritative HTTP response contracts and error codes (`400`, `403`, `404`, `409`, `422`) to Member 1 for frontend client mapping.

### 4.3 Deliverables & Acceptance Criteria
* **Deliverable D2.1:** Fully operational membership endpoints (`/join`, `/requests`, `/:userId`).
* **Deliverable D2.2:** Profile update endpoint (`PUT /api/v1/users/profile`).
* **Deliverable D2.3:** Strict Zod validation schemas enforcing boundaries on notes and status enums.
* **Acceptance Criteria:** Attempting to join a full group returns HTTP 400; duplicate requests return HTTP 409; non-owners accessing `/requests` receive HTTP 403; approving a request increments the group member tally.

### 4.4 Testing Responsibilities
* Author integration test suites (`backend/tests/membership.test.js`) utilizing `supertest`.
* Verify positive flow: Student B requests join $\rightarrow$ Owner reviews $\rightarrow$ Owner approves.
* Verify negative flow: Unauthorized user attempts review; user requests join on full group; user submits malformed status.

---

## 5. Member 3: Detailed Execution Plan
**Role:** Database & Peer Matching Specialist  
**Assigned User Stories:** `US-03` (Data Layer), `US-06` (Roster Storage), `US-07` (Matching Algorithm Engine)  
**Assigned Git Branch:** `feat/backend-membership-matching` (or `feat/database-matching-engine`)

### 5.1 Step-by-Step Execution Sequence
1. **Step 3.1 — Schema & Repository Audit for Relational Consistency:**  
   Inspect `database/migrations/001_initial_schema.sql` tables `user_profiles`, `study_groups`, and `group_memberships`. Ensure data storage layer enforces foreign key constraints (`ON DELETE CASCADE` for memberships) and unique constraint `uq_group_user` on `(group_id, user_id)`.
2. **Step 3.2 — Membership Data Access Layer Expansion (`group.repository.js`):**  
   Implement and optimize repository query methods:
   * `findByGroupAndUser(groupId, userId)`: Fast indexed lookup for duplicate prevention.
   * `memberCount(groupId)`: Returns count of memberships where `status = 'accepted'`.
   * `findWithUserDetails(groupId, status)`: Relational join combining `group_memberships` with `users` and `user_profiles` to return full applicant profiles (name, email, major) for owner review.
   * `updateStatus(groupId, userId, status)`: Atomic status update with timestamp management.
3. **Step 3.3 — Design the Deterministic Compatibility Scoring Model (`matching.service.js`):**  
   Design the multi-variable matching algorithm calculating a normalized compatibility score $S \in [0, 100]\%$ based on three weighted components:
   $$\text{Score} = W_{\text{subject}} \cdot S_{\text{subject}} + W_{\text{schedule}} \cdot S_{\text{schedule}} + W_{\text{goals}} \cdot S_{\text{goals}}$$
   * *Component 1: Subject Alignment ($W_{\text{subject}} = 0.40$):*  
     Direct match between group's `subject_id` and student's `preferred_subjects` yields 40 points. Departmental alignment yields 25 points.
   * *Component 2: Schedule Availability Overlap ($W_{\text{schedule}} = 0.40$):*  
     Compares student availability time windows against the group's active meeting schedule. Overlapping hourly slots yield up to 40 points.
   * *Component 3: Learning Goal Similarity ($W_{\text{goals}} = 0.20$):*  
     Computes Jaccard similarity index across group tags and student learning goals:
     $$J(A, B) = \frac{|A \cap B|}{|A \cup B|} \times 20\text{ points}$$
4. **Step 3.4 — Explainability Breakdown Engine:**  
   Ensure the matching engine does not return an arbitrary number. Structure the return object to include an explainable breakdown:
   ```json
   {
     "overallScore": 85,
     "matchLabel": "High Compatibility",
     "breakdown": { "subjectScore": 40, "scheduleScore": 30, "goalsScore": 15 },
     "matchedCriteria": ["Direct match for CS301", "3 overlapping weekly study slots", "Shared goal: exam-prep"]
   }
   ```
5. **Step 3.5 — Recommendation Service & Controller Integration (`recommendation.controller.js`):**  
   Implement `GET /api/v1/recommendations/groups` calculating scores across all public groups where the student is not yet an active member. Sort descending by `overallScore` and expose pagination/limit controls.

### 5.2 Dependencies & Handoffs
* **Prerequisites:** Requires Member 2's Express routing scaffolding to mount the recommendation endpoints.
* **Coordination Point:** Delivers the compatibility data contract to Member 1 so recommendation cards and visual progress bars bind directly to algorithmic output.

### 5.3 Deliverables & Acceptance Criteria
* **Deliverable D3.1:** Robust repository layer with relational joins for applicant profile hydration.
* **Deliverable D3.2:** Deterministic compatibility algorithm (`matching.service.js`) with unit test verification.
* **Deliverable D3.3:** Operational `GET /api/v1/recommendations/groups` endpoint.
* **Acceptance Criteria:** Algorithm computes consistent, reproducible scores; students with identical subjects and overlapping times receive $\ge 80\%$; students with zero overlap receive $< 25\%$; explainable criteria list contains human-readable rationale.

### 5.4 Testing Responsibilities
* Author isolated unit tests (`backend/tests/matching.test.js`) verifying mathematical accuracy and edge cases of the heuristic formula.
* Verify boundary conditions: empty availability array, disjoint subjects, zero shared tags.

---

## 6. Member 4: Detailed Execution Plan
**Role:** Scheduling, Resources & Quality Assurance Lead  
**Assigned User Stories:** `US-05` / `US-06` / `US-07` Verification, Test Automation, Defect Tracking, Mid-Semester Documentation Lead  
**Assigned Git Branch:** `feat/testing-and-scheduling` (or `qa/sprint2-verification`)

### 6.1 Step-by-Step Execution Sequence
1. **Step 4.1 — Sprint 2 Test Plan & Matrix Initialization (`TEST_PLAN.md`):**  
   Review requirements for Sprint 2 features. Define test scenarios, preconditions, input vectors, and expected outcomes for test cases `TC-009` through `TC-012`, `TC-018`, and `TC-020`.
2. **Step 4.2 — Automated Backend Test Suite Authoring:**  
   Collaborate with Member 2 and Member 3 to write integration test suites using Jest and Supertest:
   * `tests/membership.test.js`: Verifies join request creation, duplicate rejection, owner authorization checks, capacity cap enforcement, and roster counter increments.
   * `tests/matching.test.js`: Verifies matching engine calculation correctness, empty profile fallbacks, and authentication requirements on `/recommendations/groups`.
3. **Step 4.3 — Defect Triaging & Resolution Logging (`DEFECT_LOG.md`):**  
   Actively test intermediate builds. When discrepancies are discovered (such as property casing differences, unhandled null profiles, or status code mismatches), record an official defect entry detailing steps to reproduce, severity, assigned owner, and verified fix commit.
4. **Step 4.4 — Regression Test Execution:**  
   Execute full regression runs of all Sprint 1 test suites (`smoke.test.js`, `auth.test.js`, `groups.test.js`) to guarantee that Sprint 2 membership changes did not introduce regressions to existing authentication and group browsing capabilities.
5. **Step 4.5 — Execution Evidence Capture & Archival:**  
   Run test suites under clean terminal logging flags (`--verbose`). Capture terminal logs and save timestamped evidence in `docs/testing/evidence/sprint2_test_results.txt`.
6. **Step 4.6 — Master Test Register Synchronization (`TEST_CASES.md`):**  
   Update the formal project test case table. Replace *Pending Execution* with verified actual results, timestamps, and **PASS** flags for all Sprint 2 test cases.
7. **Step 4.7 — Mid-Semester Project Report Compilation Lead:**  
   Coordinate team evidence gathering to compile Section 10 (*Implementation Progress*), Section 11 (*Testing Performed*), Section 12 (*Project Management Status*), and Section 14 (*Challenges & Solutions*) of the Mid-Semester Project Report.

### 6.2 Dependencies & Handoffs
* **Prerequisites:** Requires incremental feature completion from Member 2 and Member 3 to execute automated API test suites, and from Member 1 to verify client interactions.
* **Coordination Point:** Serves as the quality gatekeeper; approves PR merges into `main` only when all test suites pass with zero failures.

### 6.3 Deliverables & Acceptance Criteria
* **Deliverable D4.1:** Automated integration test suite (`membership.test.js`, `matching.test.js`) with 100% pass rate.
* **Deliverable D4.2:** Verified defect register (`DEFECT_LOG.md`) documenting authentic discovered bugs and their resolutions.
* **Deliverable D4.3:** Traceable test evidence archive (`docs/testing/evidence/sprint2_test_results.txt`).
* **Deliverable D4.4:** Updated Master Test Case Register (`docs/testing/TEST_CASES.md`) showing passed status for `TC-009` through `TC-012`.
* **Acceptance Criteria:** Zero failing tests; zero regressions in Sprint 1 suites; 100% requirements-to-test traceability maintained.

### 6.4 Testing Responsibilities
* Primary architect of system integration tests, end-to-end multi-user flow tests, and regression safety suites.

---

## 7. Step-by-Step Team Execution Sequence

### Detailed Sequence Stages

#### Step 1: Sprint 2 Planning, Interface & Contract Freeze
* **Responsible:** All Members (Team Session)
* **Prerequisites:** Sprint 1 codebase clean on `main`; all tests passing.
* **Tasks:** Freeze the exact JSON request/response contracts for `/join`, `/requests`, and `/recommendations`. Agree on availability slot format.
* **Deliverable:** Updated `docs/api/API_SPECIFICATION.md` sections for Sprint 2.
* **Exit Condition:** Signed-off contract document; zero ambiguity on payload field names.

#### Step 2: Database Repository Layer Implementation
* **Responsible:** Member 3 (Supported by Member 2)
* **Prerequisites:** Step 1 completed.
* **Tasks:** Implement `membershipRepository` methods (`findByGroupAndUser`, `memberCount`, `findWithUserDetails`, `updateStatus`).
* **Deliverable:** Operational data layer functions with relational joins.
* **Exit Condition:** Unit verification proves repository methods correctly query and persist membership entities.

#### Step 3: Backend Membership APIs & Validation Pipeline
* **Responsible:** Member 2
* **Prerequisites:** Step 2 completed.
* **Tasks:** Implement Zod schemas, auth middleware checks, and controllers for `/join`, `/requests`, and `/:userId`.
* **Deliverable:** Working Express membership endpoints.
* **Exit Condition:** Endpoints respond to Postman/cURL with correct status codes (`201`, `200`, `400`, `403`, `409`).

#### Step 4: Algorithmic Matching Engine Implementation
* **Responsible:** Member 3
* **Prerequisites:** Step 1 and Step 2 completed.
* **Tasks:** Implement `matching.service.js` with weighted scoring and criteria breakdown. Wire to `/recommendations/groups`.
* **Deliverable:** Functional recommendation service and controller.
* **Exit Condition:** Unit tests verify mathematical consistency and explainability outputs.

#### Step 5: Frontend Group Detail, Join Modal & Owner Review Panel
* **Responsible:** Member 1
* **Prerequisites:** Step 3 completed (or active contract mocking).
* **Tasks:** Build `GroupDetailPage`, `JoinRequestModal`, and `OwnerReviewPanel`. Wire to `group.service.ts`.
* **Deliverable:** Complete React views for group participation and management.
* **Exit Condition:** Client successfully submits join requests and allows owners to click Approve/Decline.

#### Step 6: Frontend Recommendations View
* **Responsible:** Member 1
* **Prerequisites:** Step 4 completed.
* **Tasks:** Build `RecommendationsPage` and compatibility badge components. Wire to client router.
* **Deliverable:** Operational recommendations screen.
* **Exit Condition:** Cards render ranked groups with correct percentage badges and criteria tags.

#### Step 7: Automated Integration Test Authoring
* **Responsible:** Member 4 (Supported by Member 2 and 3)
* **Prerequisites:** Step 3 and Step 4 completed.
* **Tasks:** Implement `tests/membership.test.js` and `tests/matching.test.js`.
* **Deliverable:** Comprehensive test files covering positive and negative edge cases.
* **Exit Condition:** Test suites execute via `npm test` and assert all acceptance criteria.

#### Step 8: End-to-End System Integration & Multi-User Walkthrough
* **Responsible:** All Members
* **Prerequisites:** Steps 5, 6, and 7 completed.
* **Tasks:** Spin up local backend and frontend. Perform live multi-user walkthrough: Student A creates group $\rightarrow$ Student B discovers and requests $\rightarrow$ Student A approves $\rightarrow$ Roster updates.
* **Deliverable:** Verified full-stack user journey.
* **Exit Condition:** Zero console errors; smooth UI state transitions; data verified in repository.

#### Step 9: Defect Resolution, Regression Sweep & Evidence Capture
* **Responsible:** Member 4 (All Members remediate assigned bugs)
* **Prerequisites:** Step 8 completed.
* **Tasks:** Log discovered defects in `DEFECT_LOG.md`. Re-run regression suites. Capture CLI test evidence in `sprint2_test_results.txt`.
* **Deliverable:** Clean test run log; closed defect tickets; updated `TEST_CASES.md`.
* **Exit Condition:** 100% test pass rate across all suites; zero open S1/S2 defects.

#### Step 10: Sprint 2 Review, Retrospective & Documentation Packaging
* **Responsible:** All Members
* **Prerequisites:** Step 9 completed.
* **Tasks:** Update `MEETING_LOG.md` (Meeting 03), `CONTRIBUTION_RECORD.md`, and compile Sprint 2 summary.
* **Deliverable:** Synchronized project repository ready for Mid-Semester Evaluation.
* **Exit Condition:** Repository tagged `v0.5.0-midsem`; documentation ready for report generation.

---

## 8. Day-by-Day Sprint Timeline

*Assumption: 2-Week Sprint (10 Working Days across 2 Weeks).*

| Day | Focus Stage | Member 1 (Frontend) | Member 2 (Backend) | Member 3 (DB/Matching) | Member 4 (QA/Lead) | Milestone / EOD Target |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **Day 1** | Planning & Contracts | Review UI wireframes for Group Detail & Review Panel | Draft Zod schemas for `/join` and `/requests` | Define JSON shape for availability & match scores | Initialize Sprint 2 test plan (`TC-009` to `TC-012`) | **Milestone 1:** API contracts & payload specs frozen |
| **Day 2** | Data Layer & Scaffolding | Build `ProfilePage` form controls & availability picker | Implement validation middleware & route signatures | Implement `membershipRepository` relational queries | Configure test fixtures & multi-user test data helpers | **Milestone 2:** Repository query layer operational |
| **Day 3** | Core Development | Wire `group.service.ts` API wrappers | Implement `requestToJoin` controller logic & duplicate guard | Implement `matching.service.js` weighted formula | Author `TC-009` join request test cases | Join request submission functional on backend |
| **Day 4** | Authorization & Workflow | Implement `JoinRequestModal` & character counter | Implement `getPendingRequests` & owner auth check (403) | Implement matching explainability breakdown logic | Author `TC-010` owner authorization test cases | Owner review queries functional on backend |
| **Day 5** | Approval & Algorithm | Build `OwnerReviewPanel` UI component | Implement `respondToRequest` with capacity enforcement | Implement `GET /recommendations/groups` controller | Author boundary tests for `max_members` capacity cap | **Milestone 3:** Core membership workflow complete on backend |
| **Day 6** | UI View Integration | Build `GroupDetailPage` with conditional role views | Implement `PUT /users/profile` controller & validators | Wire recommendation sorting and limit queries | Author `TC-011` / `TC-012` matching algorithm tests | Group Detail view renders live backend group data |
| **Day 7** | Client Feature Binding | Build `RecommendationsPage` & compatibility badge widgets | Support frontend integration; address contract adjustments | Optimize relational joins for profile hydration | Execute first full integration test run | All Sprint 2 features wired end-to-end |
| **Day 8** | Integration & Walkthrough | Mount `/recommendations` in router; responsive mobile audit | Refine error handling envelopes and status codes | Assist with edge case query bugfixes | Conduct multi-user golden flow walkthrough; log bugs | **Milestone 4:** Full golden path functional in browser |
| **Day 9** | Quality Assurance & Fixes | Fix client-side edge cases (loading spinners, toast alerts) | Remediate backend defects logged in `DEFECT_LOG.md` | Verify database consistency and cascading rules | Execute full regression suite; capture evidence logs | **Milestone 5:** 100% test pass rate achieved |
| **Day 10**| Sprint Review & Packaging | Final UI polish & accessibility verification | Code cleanup & docstring verification | Audit schema alignment with migration scripts | Update `TEST_CASES.md`, `MEETING_LOG.md`, package milestone | **Milestone 6:** Sprint 2 Exit Gate achieved |

---

## 9. Integration and GitHub Workflow

### 9.1 Branching Strategy
* **Protected Branch:** `main` represents the stable, shippable codebase. Direct pushes to `main` are restricted.
* **Backend & Matching Branch:** `feat/backend-membership-matching` (Members 2, 3, and 4).
* **Frontend Branch:** `feat/frontend-membership-matching` (Member 1).
* **Hotfix/Bugfix Branching:** When defects are logged in `DEFECT_LOG.md`, fixes are developed on dedicated branches named `fix/DEF-xxx-<title>` branched from the appropriate feature branch.

### 9.2 Commit Message Standard
Commits must follow the Conventional Commits specification, tagged with the relevant User Story or Test Case ID:
* `feat(membership): implement owner join request approval endpoint [US-06]`
* `feat(matching): implement weighted schedule and goal compatibility formula [US-07]`
* `test(membership): add boundary test case for group capacity limit [TC-010]`
* `fix(profile): normalize camelCase mapping in user sanitize helper [DEF-001]`
* `docs(scrum): update meeting log for Sprint 2 review [US-06]`

### 9.3 Pull Request & Code Review Process
1. **PR Creation:** When a feature branch fulfills its assigned deliverables, open a Pull Request targeting `main`.
2. **Review Requirement:** Every PR requires at least one approving review from a peer member (e.g., Member 2 reviews Member 3's DB PR; Member 4 reviews all PRs for test coverage).
3. **Automated Verification:** All tests must run cleanly (`npm test`) before merge approval.
4. **Merge Execution:** Merges must be executed with `--no-ff` (No Fast-Forward) to preserve distinct branch topology in the Git history graph.

---

## 10. Testing and Quality Assurance Plan

### 10.1 Testing Levels & Ownership

| Test Level | Scope | Tools | Responsible Member |
| :--- | :--- | :--- | :--- |
| **Unit Testing** | Individual utility functions, Zod schemas, mathematical matching formula | Jest, Vitest | Member 2 & 3 |
| **API Integration Testing** | HTTP request/response lifecycles, auth middleware, status codes, payload shapes | Supertest, Jest | Member 2 & 4 |
| **Database Testing** | Relational integrity, foreign key cascading, unique constraints, duplicate queries | In-Memory / PostgreSQL | Member 3 |
| **Frontend UI Testing** | Component rendering, modal open/close, role-based conditional display | Vitest, Testing Library | Member 1 |
| **End-to-End Workflow Testing** | Multi-user user journeys (Register $\rightarrow$ Group $\rightarrow$ Join $\rightarrow$ Approve) | Browser Walkthrough | Member 4 (All team) |
| **Regression Testing** | Automated re-execution of Sprint 1 test suites (`auth`, `groups`, `smoke`) | Jest CLI | Member 4 |

### 10.2 Sprint 2 Test Case Specifications

* **`TC-009` (Join Request Submission):**
  * *Precondition:* Student B is authenticated; public group exists with available capacity.
  * *Input:* `POST /api/v1/groups/:id/join` with `{ "requestNote": "Seeking study group for CS301" }`.
  * *Expected Result:* HTTP 201 Created; status is `pending`; record exists in `group_memberships`.
* **`TC-010` (Owner Review & Approval):**
  * *Precondition:* Student A (Owner) is authenticated; Student B has a `pending` request.
  * *Input:* `PATCH /api/v1/groups/:id/requests/:userId` with `{ "status": "accepted" }`.
  * *Expected Result:* HTTP 200 OK; status updated to `accepted`; group member count increments by 1.
* **`TC-010-B` (Capacity Boundary Guard):**
  * *Precondition:* Group has `max_members = 3` and already has 3 accepted members.
  * *Input:* Owner attempts to approve a 4th pending request.
  * *Expected Result:* HTTP 400 Bad Request; error message indicates group capacity reached; status remains `pending`.
* **`TC-010-C` (Authorization Security Guard):**
  * *Precondition:* Student C (neither owner nor admin) attempts to review or approve requests.
  * *Input:* `GET /api/v1/groups/:id/requests` using Student C's Bearer token.
  * *Expected Result:* HTTP 403 Forbidden; zero applicant data leaked.
* **`TC-011` (Matching Engine Calculation):**
  * *Input:* Profile with identical subject `CS301` and 2 overlapping availability windows.
  * *Expected Result:* Algorithm outputs `overallScore` $\ge 80\%$ with criteria tags listed.
* **`TC-012` (Recommendations Endpoint Security & Ranking):**
  * *Input:* `GET /api/v1/recommendations/groups` without Bearer token.
  * *Expected Result:* HTTP 401 Unauthorized. With valid token: HTTP 200 OK sorted descending by score.

### 10.3 Defect Management Protocol
When an anomaly is encountered during testing:
1. Log defect in `docs/testing/DEFECT_LOG.md` with unique ID `DEF-xxx`.
2. Categorize severity: `S1 (Blocker)`, `S2 (Major)`, `S3 (Minor)`, `S4 (Cosmetic)`.
3. Assign defect to responsible member in daily standup.
4. Implement fix on branch `fix/DEF-xxx-<title>`, re-verify test case, and update status to `RESOLVED`.

---

## 11. Consolidated Responsibility Matrix

| Feature / Task | Priority | Primary Owner | Supporting Member | Dependencies | Key Deliverable | Acceptance Criteria |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **API Contract Freeze** | P0 | Member 2 | Member 1, 3 | Sprint 1 code | API contract specification | Signed off by all 4 members |
| **Membership Repository Layer** | P0 | Member 3 | Member 2 | API Contract | `group.repository.js` updates | Relational queries execute cleanly |
| **Membership Validation Schemas** | P1 | Member 2 | Member 4 | API Contract | `membership.validator.js` | Invalid status or notes return 422 |
| **Join Request Endpoint (`/join`)** | P1 | Member 2 | Member 3 | Repository layer | `membership.controller.js` | Prevents duplicate & self-join (409/400) |
| **Owner Review API (`/requests`)** | P1 | Member 2 | Member 3 | Join endpoint | Owner review controller | Non-owners receive 403 Forbidden |
| **Approval & Capacity Guard** | P1 | Member 2 | Member 3, 4 | Owner review API | Approval action handler | Rejects approval when group is full (400) |
| **Profile Update API (`/profile`)** | P2 | Member 2 | Member 1 | User repository | Profile update endpoint | Persists availability and goals |
| **Heuristic Matching Algorithm** | P1 | Member 3 | Member 4 | Contract freeze | `matching.service.js` | Computes weighted score & criteria |
| **Recommendations Endpoint** | P1 | Member 3 | Member 2 | Matching service | `recommendation.controller.js` | Returns groups sorted by match score |
| **Client Group Service Extension** | P1 | Member 1 | Member 2 | API Contract | `group.service.ts` updates | Typesafe client Axios wrappers |
| **Group Detail View & Roles** | P1 | Member 1 | Member 2 | Client service | `GroupDetailPage.tsx` | Correctly differentiates owner/applicant |
| **Request to Join Modal** | P1 | Member 1 | Member 2 | Detail view | `JoinRequestModal.tsx` | Validates note; optimistic UI update |
| **Owner Review Dashboard UI** | P1 | Member 1 | Member 2 | Detail view | `OwnerReviewPanel.tsx` | Approve/Decline triggers update roster |
| **Recommendations Catalog UI** | P2 | Member 1 | Member 3 | Recommendations API| `RecommendationsPage.tsx` | Renders compatibility badges & tags |
| **Automated Membership Tests** | P1 | Member 4 | Member 2 | Membership APIs | `tests/membership.test.js` | Automated coverage for TC-009/TC-010 |
| **Automated Matching Tests** | P1 | Member 4 | Member 3 | Matching APIs | `tests/matching.test.js` | Automated coverage for TC-011/TC-012 |
| **Defect Triaging & Quality Gate**| P1 | Member 4 | All Members | Test execution | `DEFECT_LOG.md` | All discovered bugs tracked & closed |
| **Evidence Capture & Test Register**| P1 | Member 4 | All Members | Test execution | `sprint2_test_results.txt` | 100% pass rate logged in test register |
| **Mid-Sem Report Coordination** | P1 | Member 4 | All Members | All Sprint 2 artifacts| Report draft sections | Meets university rubric structure |

---

## 12. Sprint Deliverables and Definition of Done

### 12.1 Explicit Sprint Deliverables
1. **Integrated Source Code Increment:**
   * Group membership request, review, and approval feature set.
   * Group capacity boundary enforcement engine.
   * Heuristic peer and study group matching engine with explainable criteria.
   * Frontend views for Group Detail, Request to Join, Owner Review, and Recommendations.
2. **Automated Test Evidence:**
   * Integration test suites `membership.test.js` and `matching.test.js` with $\ge 11$ new automated tests.
   * Frontend component interaction tests (`MembershipWorkflow.test.ts`).
   * Clean regression execution output covering all 18 Sprint 1 tests.
   * Official CLI evidence log saved at `docs/testing/evidence/sprint2_test_results.txt`.
3. **Traceability & Scrum Documentation:**
   * Updated Master Test Case Register (`docs/testing/TEST_CASES.md`) with actual results for `TC-009`–`TC-012`.
   * Official Defect Tracking Register (`docs/testing/DEFECT_LOG.md`) documenting triaged issues.
   * Team Meeting Log updated with Meeting 03 in `docs/scrum/MEETING_LOG.md`.
   * Individual Contribution Log updated for all 4 members in `docs/scrum/CONTRIBUTION_RECORD.md`.

### 12.2 Sprint 2 Definition of Done (DoD) Checklist
- [ ] Working end-to-end user flow demonstrable in the live application: Student A creates group $\rightarrow$ Student B sends join request with note $\rightarrow$ Student A reviews in Owner Dashboard $\rightarrow$ Student A approves $\rightarrow$ Group roster and count increment live.
- [ ] Capacity limits enforced at both database and controller levels; full groups reject join requests.
- [ ] Non-owner access to administrative group endpoints strictly rejected with HTTP 403 Forbidden.
- [ ] Algorithm computes deterministic compatibility scores ($\ge 80\%$ for high match, $< 25\%$ for disjoint).
- [ ] 100% automated test pass rate across both backend (Jest) and frontend (Vitest) suites.
- [ ] Zero TypeScript compiler errors (`tsc --noEmit` exits with code 0).
- [ ] All code committed and merged into `main` via PRs using proper conventional commit formatting.
- [ ] Test evidence, defect records, and meeting minutes updated and committed to the repository.

---

## 13. Sprint Review and Retrospective Plan

### 13.1 Sprint 2 Review Agenda (Demonstration)
* **Demo Part 1 (Student B Perspective):** Student B logs in, browses the group catalog, opens an interesting group, and submits a join request with a personalized introduction note.
* **Demo Part 2 (Student A / Owner Perspective):** Group creator logs in, navigates to the group, observes the pending request notification, reviews Student B's academic profile and note, and clicks "Approve".
* **Demo Part 3 (Roster & Boundary Verification):** Verify that Student B now appears as an active member in the roster, the counter reflects the new count, and attempting to exceed max members is blocked.
* **Demo Part 4 (Algorithmic Recommendations):** Navigate to the Recommendations hub, demonstrate ranked compatibility badges, and inspect the explainable criteria breakdown.

### 13.2 Sprint Retrospective Framework
At the conclusion of Sprint 2, the team will hold a structured retrospective addressing:
1. *What went well:* (e.g., contract freeze prevented frontend/backend mismatch; in-memory store allowed frictionless testing).
2. *What challenges were encountered:* (e.g., casing inconsistencies between snake_case DB fields and camelCase API contracts; race condition considerations during concurrent join requests).
3. *Process improvements for Sprint 3:* (e.g., earlier UI wireframe reviews before service authoring; automated lint checks on pull requests).

---

## 14. Proposed Sprint 3 Scope (High-Level Preview)

Following successful completion of Sprint 2, Sprint 3 will focus on **Collaborative Scheduling and Shared Resources**:
* **User Story `US-08` / `US-09`:** Study Session Creation & Scheduling with start/end time boundary validation.
* **User Story `US-10`:** Time Collision & Schedule Conflict Detection Algorithm (warning members when a scheduled session overlaps with existing commitments).
* **User Story `US-11`:** Calendar Visualizations (monthly and weekly study timetable views) and Attendance RSVP tracking (`attending`, `declined`, `tentative`).
* **User Story `US-12`:** Centralized Study Resource Sharing (document links, lecture notes, and file metadata repository within study groups).

---

## 15. Four Copy-Ready Member Prompts

### Prompt for Member 1: Frontend & UI/UX Specialist

```markdown
You are Member 1 (Frontend & UI/UX Specialist) on the four-member StudySync development team.

YOUR ROLE & SPRINT 2 RESPONSIBILITIES:
You are responsible for implementing the client-side presentation layer for Sprint 2:
1. Extend `frontend/src/services/group.service.ts` to include typed Axios methods for:
   - requestToJoin(groupId, note)
   - getPendingRequests(groupId)
   - respondToRequest(groupId, userId, status)
   - getMyMemberships()
   - getRecommendations()
2. Implement `frontend/src/pages/GroupDetailPage.tsx`:
   - Display group metadata, subject, capacity counter, tags, and member roster.
   - Conditionally render "Request to Join" button for non-members, "Request Pending" badge for applicants, and "Owner Review Dashboard" for group creators.
3. Implement `JoinRequestModal.tsx`:
   - Modal overlay allowing students to enter an introduction note (max 500 characters) with real-time character counting and submission feedback.
4. Implement `OwnerReviewPanel.tsx`:
   - Embedded owner panel rendering pending applicant cards with full name, email, note, and distinct "Approve" (green) and "Decline" (gray/red) buttons.
   - Ensure approving/declining immediately updates the visible roster and counter.
5. Implement `frontend/src/pages/RecommendationsPage.tsx`:
   - Hub displaying algorithmically ranked study groups with overall compatibility percentage badges (e.g., "85% Match"), color indicators, and explainable criteria tags.
6. Mount routes `/groups/:id` and `/recommendations` in `App.tsx` under `ProtectedRoute`. Add a "Matches" navigation link with a Sparkles icon to `Navbar.tsx`.

OPERATIONAL CONSTRAINTS & EXECUTION ORDER:
- Work strictly on branch: `feat/frontend-membership-matching`.
- DO NOT alter backend code, database schemas, or API endpoint routes. Consume the contracts agreed upon with Member 2.
- Step 1: Update API client service wrappers.
- Step 2: Build `GroupDetailPage` and `JoinRequestModal`.
- Step 3: Build `OwnerReviewPanel` with optimistic state update.
- Step 4: Build `RecommendationsPage` and wire router navigation.
- Step 5: Verify clean TypeScript compilation (`npx tsc --noEmit`) and run Vitest component tests.
- DO NOT start Sprint 3 scheduling or calendar features. Focus strictly on Sprint 2 scope.
- Use conventional commits tagged with User Story IDs: `feat(frontend): ... [US-05]`.
```

---

### Prompt for Member 2: Backend & Authentication Specialist

```markdown
You are Member 2 (Backend & Authentication Specialist) on the four-member StudySync development team.

YOUR ROLE & SPRINT 2 RESPONSIBILITIES:
You are responsible for implementing the server-side business logic, validation, and API routes for Sprint 2:
1. Create `backend/src/validators/membership.validator.js`:
   - `joinRequestSchema`: Validates optional `requestNote` (string, max 500 chars).
   - `updateMembershipSchema`: Validates mandatory `status` restricted strictly to enum `['accepted', 'rejected']`.
2. Implement `backend/src/controllers/membership.controller.js`:
   - `requestToJoin(req, res)`: Prevents creator self-joining (400); prevents duplicate requests (409); verifies group capacity is not exceeded (400); creates pending membership (201).
   - `getPendingRequests(req, res)`: Strictly checks that `group.creator_id === req.user.id`; rejects non-owners with HTTP 403 Forbidden; returns pending applicants with user details.
   - `respondToRequest(req, res)`: Verifies group ownership (403); checks capacity cap before accepting (400); updates membership status to accepted or rejected; returns updated record.
   - `getMyMemberships(req, res)`: Returns caller's memberships enriched with group details.
3. Wire routes in `backend/src/routes/group.routes.js`:
   - Mount `POST /:id/join`, `GET /:id/requests`, `PATCH /:id/requests/:userId`, and `GET /user/my-memberships` with `protect` and `validate()` middleware.
4. Wire recommendation routes in `backend/src/routes/recommendation.routes.js` and mount under `/api/v1/recommendations` in `app.js`.

OPERATIONAL CONSTRAINTS & EXECUTION ORDER:
- Work strictly on branch: `feat/backend-membership-matching`.
- Ensure all responses strictly follow `{ success, data, message, errors }`.
- Step 1: Create Zod validation schemas.
- Step 2: Implement membership controller domain logic and guards.
- Step 3: Mount routes and verify middleware ordering.
- Step 4: Collaborate with Member 4 to run integration test suites and verify HTTP status codes.
- DO NOT start Sprint 3 session scheduling or resource sharing routes. Focus strictly on Sprint 2 scope.
- Use conventional commits tagged with User Story IDs: `feat(membership): ... [US-05][US-06]`.
```

---

### Prompt for Member 3: Database & Peer Matching Specialist

```markdown
You are Member 3 (Database & Peer Matching Specialist) on the four-member StudySync development team.

YOUR ROLE & SPRINT 2 RESPONSIBILITIES:
You are responsible for the data access layer, relational queries, and the heuristic matching engine for Sprint 2:
1. Update `backend/src/repositories/group.repository.js`:
   - Implement `findByGroupAndUser(groupId, userId)` for indexed membership checks.
   - Implement `memberCount(groupId)` returning count of accepted members.
   - Implement `findWithUserDetails(groupId, status)` performing a relational join with `users` and `user_profiles` to return applicant full names, emails, and majors for owner review.
   - Implement `updateStatus(groupId, userId, status)` managing timestamp updates (`joined_at`).
2. Update `backend/src/repositories/user.repository.js`:
   - Ensure `sanitize(user)` reliably maps and projects camelCase `fullName` alongside snake_case `full_name` to prevent contract mismatch bugs.
3. Create `backend/src/services/matching.service.js`:
   - Implement `calculateCompatibility(profile, group)` computing a score $S \in [0, 100]\%$:
     * Subject alignment (40% weight): Direct course match yields 40 pts; department match yields 25 pts.
     * Schedule availability (40% weight): Active overlapping weekly study windows yield up to 40 pts.
     * Goal/tag similarity (20% weight): Jaccard similarity across group tags and student learning goals.
   - Include an explainable output object with `overallScore`, `matchLabel`, `breakdown`, and a human-readable `matchedCriteria` array.
   - Implement `getRecommendedGroupsForUser(userId)` returning ranked public groups sorted descending by score.
4. Implement `backend/src/controllers/recommendation.controller.js` and wire to matching service.

OPERATIONAL CONSTRAINTS & EXECUTION ORDER:
- Work strictly on branch: `feat/backend-membership-matching` (or `feat/database-matching-engine`).
- Step 1: Implement and verify repository queries and relational joins.
- Step 2: Build the heuristic compatibility calculation logic.
- Step 3: Implement explainability breakdown generator.
- Step 4: Connect recommendation controller and verify mathematical scoring consistency with Member 4.
- DO NOT start Sprint 3 session attendee database models or resource table indexing.
- Use conventional commits tagged with User Story IDs: `feat(matching): ... [US-07]`.
```

---

### Prompt for Member 4: Scheduling, Resources & QA Lead

```markdown
You are Member 4 (Scheduling, Resources & QA Lead) on the four-member StudySync development team.

YOUR ROLE & SPRINT 2 RESPONSIBILITIES:
You are responsible for quality assurance, automated test suite authoring, defect tracking, and mid-semester evidence documentation for Sprint 2:
1. Create `backend/tests/membership.test.js` using Jest and Supertest covering:
   - Non-owner submits pending join request with note (`TC-009`, 201 Created).
   - Duplicate join request rejected (`TC-009`, 409 Conflict).
   - Owner joining own group rejected (`TC-009`, 400 Bad Request).
   - Owner views pending requests with applicant names (`TC-010`, 200 OK).
   - Non-owner blocked from viewing pending requests (`TC-010`, 403 Forbidden).
   - Owner approves request (`TC-010`, 200 OK) $\rightarrow$ member count increments live.
   - Approval on full group rejected by capacity guard (`TC-010-B`, 400 Bad Request).
2. Create `backend/tests/matching.test.js`:
   - Unit tests for heuristic formula verifying $\ge 80\%$ score for direct matches and explainable criteria tags.
   - Integration tests for `GET /api/v1/recommendations/groups` verifying sorted order and 401 guard.
3. Manage Defect Tracking:
   - Actively log any discovered defects in `docs/testing/DEFECT_LOG.md` (`DEF-xxx`), assign to members, and verify resolutions.
4. Maintain Test Evidence & Registers:
   - Execute test suites (`npm test -- --verbose`) and save complete output to `docs/testing/evidence/sprint2_test_results.txt`.
   - Update `docs/testing/TEST_CASES.md` table, marking `TC-009` through `TC-012` as PASS with actual verified results.
5. Scrum Documentation & Milestone Packaging:
   - Record Meeting 03 in `docs/scrum/MEETING_LOG.md`.
   - Record Sprint 2 individual member effort in `docs/scrum/CONTRIBUTION_RECORD.md`.
   - Coordinate team inputs for the Mid-Semester Evaluation Report draft.

OPERATIONAL CONSTRAINTS & EXECUTION ORDER:
- Work strictly on branch: `feat/backend-membership-matching` (or `qa/sprint2-verification`).
- Step 1: Define test scenario matrix in `TEST_PLAN.md`.
- Step 2: Author integration tests for membership and matching endpoints as implementations arrive.
- Step 3: Execute regression suites (`auth`, `groups`) to verify zero regressions.
- Step 4: Log and verify defect resolutions in `DEFECT_LOG.md`.
- Step 5: Archive official test evidence and update Scrum tracking documentation.
- DO NOT start Sprint 3 session conflict detection algorithms until Sprint 2 exit gate is met.
- Use conventional commits tagged with Test Case IDs: `test(membership,matching): ... [TC-009][TC-010]`.
```
