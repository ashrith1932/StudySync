# Mid-Semester Project Report: StudySync
**Course:** Software Engineering & Project Management  
**Evaluation Milestone:** Mid-Semester Evaluation (Weightage: 20 Marks)  
**Submission Requirement:** 10–15 pages PDF adhering to Section 3.A  

---

## 1. Cover Page
- **Project Title:** StudySync — Peer Matching & Collaborative Study Group Platform
- **Group Number:** Group 15
- **Team Members & Registration Numbers:**
  1. Yadavalli Sumanth Chowdary — Reg No: 20243322 — Frontend Engineering & UI/UX Design
  2. Vuppalapanchu Karthikeya Lalith — Reg No: 20243321 — Backend API & Authentication Services
  3. Vem Nagarjuna Reddy — Reg No: 20243315 — Relational Database & Matching Algorithm
  4. Tummala Ashrith Reddy — Reg No: 20243297 — Scheduling Systems, QA & Documentation Lead
- **Course Name & Section:** Software Engineering (Section F)
- **Supervisor / Instructor Name:** Dr. Komal Gupta

---

## 2. Problem Statement and Motivation
Higher education students face severe friction in discovering compatible study peers and establishing structured study groups. Traditional informal channels (social messaging apps, message boards) lack subject context, schedule alignment, accountability, and session tracking. This results in inactive study groups, mismatched academic paces, and poor academic collaboration. StudySync provides an integrated platform addressing these challenges through course-centric groups, automated schedule matching, conflict-free session planning, and participation tracking.

---

## 3. Project Objectives
1. Provide a course-centric study group directory with search, filtering, and capacity caps.
2. Develop a multi-variable matching engine computing compatibility across subjects, schedules, and learning goals.
3. Streamline membership workflows with request submissions and creator approvals.
4. Provide calendar scheduling with conflict detection across member availability.
5. Centralize academic resource sharing and attendance accountability.
6. Achieve 100% requirements-to-test traceability with zero security credential leaks.

---

## 4. Scope of the Project
- **Features Included:** User registration & JWT authentication; Student profiles and weekly availability; Group creation and directory; Heuristic peer matching; Join requests & approvals; Session scheduling & conflict guard; Attendance RSVP; Shared study resources.
- **Features Excluded:** Custom real-time video conferencing (external links used); real-time WebSocket messaging (deferred to v2); financial transactions.
- **Assumptions & Constraints:** Standard modern web browsers; PostgreSQL 14+ engine; university email credentials; evaluation target of 40–60% completion at mid-sem.

---

## 5. Stakeholder Identification
- **University Students (Primary End Users):** Seek peer collaboration, accountability, and schedule-compatible study partners.
- **Group Creators / Student Leaders:** Manage group rosters, approve requests, schedule meetings, and share materials.
- **Course Instructors / TAs:** Academic observers evaluating project rigor and student participation.
- **System Administrators:** Maintain academic subjects and monitor platform operational health.

---

## 6. Requirements Specification
- **Functional Requirements:** `FR-001` through `FR-020` detailed in `docs/requirements/SRS.md`.
- **Non-Functional Requirements:** `NFR-001` (bcrypt hashing), `NFR-002` (<200ms search latency), `NFR-003` (responsive UI 360px+), `NFR-004` (relational integrity).
- **Prioritization:** MoSCoW prioritization defined in `docs/scrum/BACKLOG.md`.

---

## 7. Requirements Model
- **Use-Case Model:** Use-case diagram (`docs/diagrams/use_case_diagram.mermaid`) and descriptions (`docs/diagrams/use_case_descriptions.md`).
- **User Stories & Acceptance Criteria:** Product backlog user stories (`US-01` through `US-14`).

---

## 8. System Design
- **Architecture Diagram:** Three-tier layered architecture (`docs/diagrams/system_architecture.mermaid`).
- **Module Description:** Detailed in `docs/architecture/SYSTEM_ARCHITECTURE.md`.
- **Database Schema & ER Diagram:** 3NF relational model (`docs/diagrams/er_diagram.mermaid` & `database/schema/schema_documentation.md`).
- **UML Diagrams:** Sequence diagrams for Auth & Join requests (`docs/diagrams/sequence_diagrams.mermaid`) and Activity diagram for session scheduling (`docs/diagrams/activity_diagram.mermaid`).

---

## 9. Technology Stack and Justification
- **Frontend (React 18, Vite, Tailwind CSS, TypeScript):** Rapid bundling, strong type safety matching backend API contracts, utility-first responsive styling.
- **Backend (Node.js, Express.js, REST):** Asynchronous event-driven I/O, lightweight modular middleware pipeline, industry-standard REST API conventions.
- **Database (PostgreSQL 14+):** Robust ACID guarantees, native JSONB support for recurring availability slots with GIN indexes, strong foreign key constraint enforcement.
- **Testing (Jest, Supertest, Vitest):** Multi-tier test pyramid covering units, API endpoints, and UI components.

---

## 10. Implementation Progress (Mid-Semester Milestone: 50%)
- **Features Completed:**
  - Database migrations and seed datasets.
  - Express server architecture and API gateway routing.
  - JWT authentication and bcrypt password security (`/register`, `/login`, `/me`).
  - Student profile setup and recurring weekly availability persistence.
  - Study group creation, browsing, and multi-criteria search.
- **Features Under Development:**
  - Automated compatibility scoring engine.
  - Join request and approval workflow.
- **Screenshots of Working System:** Included in Report Appendix (`docs/testing/evidence/`).
- **Important Implementation Decisions:** Enforcing standard `{ success, data, error, meta }` response envelope; using JSONB with GIN indexing for student availability schedules.

---

## 11. Testing Performed
- Test Case Register (`TC-001` through `TC-020`) documented in `docs/testing/TEST_CASES.md`.
- Automated test coverage results and execution logs.
- Evidence screenshots of API Supertest executions and browser UI rendering.

---

## 12. Project-Management Status
- **Original Plan vs. Current Progress:** Phase 0 complete; Increment 1 fully verified; Increment 2 baseline operational (50% progress achieved).
- **Delayed or Pending Tasks:** Advanced calendar collision heuristics scheduled for Sprint 3.
- **Risk Mitigation Status:** All 6 major risks tracked in `docs/scrum/RISK_REGISTER.md` with active mitigation controls.

---

## 13. Individual Contribution Table
- Complete task allocation matrix, git commit breakdown, and signed confirmation table detailed in `docs/scrum/CONTRIBUTION_RECORD.md`.

---

## 14. Challenges Faced and Solutions Attempted
- **Challenge 1:** Reconciling flexible student availability across different weekdays and hours.
  - *Solution:* Implemented normalized JSONB availability schema with GIN indexing in PostgreSQL instead of brittle denormalized string flags.
- **Challenge 2:** Ensuring frontend and backend stay synchronized across API changes.
  - *Solution:* Created shared TypeScript interfaces (`frontend/src/types/index.ts`) matching authoritative API specs (`docs/api/API_SPECIFICATION.md`).

---

## 15. Work Planned for the Remaining Semester
- **Sprint 3:** Study session scheduling, conflict detection algorithms, calendar view, RSVP and attendance check-in, shared resource repository.
- **Sprint 4:** System-wide integration and regression testing, cross-browser optimization, security auditing, final project report, and master demonstration.

---

## 16. References
1. Pressman, R. S., & Maxim, B. R. *Software Engineering: A Practitioner's Approach*. McGraw-Hill.
2. Sommerville, I. *Software Engineering*. Pearson.
3. PostgreSQL Global Development Group. *PostgreSQL 14 Documentation*.
4. Express.js & React Official Documentation.
