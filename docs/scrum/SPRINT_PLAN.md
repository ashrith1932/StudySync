# StudySync Sprint Planning & Delivery Cadence

## Overview
The four-member team will execute four 2-week sprints across the semester. The mid-semester evaluation milestone falls at the end of **Sprint 2**, requiring **40–60% progress** and at least one operational end-to-end user journey.

---

## Sprint 1: Foundation & Increment 1 Scaffolding
- **Sprint Goal:** Establish database schemas, user authentication, profile setup, and study group creation/browsing.
- **Velocity Target:** 20 Story Points
- **Commitments & Task Allocations:**
  - **Member 1 (Frontend):** UI Shell, Tailwind theme setup, React Router setup, Registration & Login forms, Group Browse UI (`US-01`, `US-04` - 5 pts).
  - **Member 2 (Backend):** Express app structure, JWT auth endpoints (`/register`, `/login`, `/me`), Zod validation, bcrypt integration (`US-01`, `US-02` - 5 pts).
  - **Member 3 (Database):** Initial schema migration (`001_initial_schema.sql`), Seed dataset, Group CRUD repository methods (`US-03`, `US-04` - 5 pts).
  - **Member 4 (QA/Setup):** Test harness setup (Jest/Vitest), CI linting rules, Traceability Matrix initialization, Test cases for Auth (`US-01`, `US-03` - 5 pts).
- **Milestone Exit Gate:** Users can register, log in, create a study group, and view it in the group directory.

---

## Sprint 2: Membership Workflow, Matching Baseline & Mid-Semester Release
- **Sprint Goal:** Complete group membership join/approval workflow, baseline peer matching, and achieve Mid-Sem Evaluation readiness (50% progress, working end-to-end flow).
- **Velocity Target:** 16 Story Points
- **Commitments & Task Allocations:**
  - **Member 1 (Frontend):** Group detail view, Membership request modal, Owner approval dashboard, Recommendation cards (`US-05`, `US-06` - 4 pts).
  - **Member 2 (Backend):** Membership controller and approval endpoints, Capacity limit enforcement guards (`US-05`, `US-06` - 4 pts).
  - **Member 3 (Database):** Heuristic peer and group compatibility algorithm (subject + schedule + goals), recommendation API (`US-07` - 4 pts).
  - **Member 4 (QA & Mid-Sem Lead):** Mid-Semester Report compilation, End-to-end demo script verification, 5-7 minute demonstration video recording (`US-05`, `US-07`, Mid-Sem Package - 4 pts).
- **Milestone Exit Gate (Mid-Semester Evaluation):**
  - [x] Full working end-to-end flow: Student Register $\rightarrow$ Profile $\rightarrow$ Group Creation $\rightarrow$ Second Student Join Request $\rightarrow$ Owner Approval.
  - [x] 10–15 page Mid-Semester Report PDF.
  - [x] 5–7 min demonstration video link in `DEMO_VIDEO_LINK.txt`.

---

## Sprint 3: Scheduling, Conflict Detection & Resource Sharing
- **Sprint Goal:** Implement study session scheduling with overlap detection, calendar visualization, RSVP tracking, and shared resource repository.
- **Velocity Target:** 18 Story Points
- **Commitments & Task Allocations:**
  - **Member 1 (Frontend):** Monthly/weekly calendar view, Session creation modal, RSVP buttons, Resource sharing drawer (`US-08`, `US-10`, `US-12` - 5 pts).
  - **Member 2 (Backend):** Session route integration, Resource access control middleware, centralized file metadata handlers (`US-08`, `US-12` - 4 pts).
  - **Member 3 (Database):** Session attendee relational queries, calendar range filtering query optimizations, resource table indexing (`US-09`, `US-11` - 4 pts).
  - **Member 4 (QA & Scheduling Lead):** Session overlap conflict detection algorithm, attendance check-in logic, automated session boundary tests (`US-08`, `US-09`, `US-11` - 5 pts).
- **Milestone Exit Gate:** Working calendar scheduling with collision warnings, resource downloads, and attendance check-in.

---

## Sprint 4: System Integration, Security Hardening & Final Release
- **Sprint Goal:** End-to-end regression testing, cross-browser responsiveness, performance benchmarking, final report, and project packaging.
- **Velocity Target:** 10 Story Points
- **Commitments & Task Allocations:**
  - **Member 1 (Frontend):** Mobile responsive polish (360px+), loading states, toast notifications, UI accessibility checks (`US-13`, `US-14` - 3 pts).
  - **Member 2 (Backend):** Security hardening, rate limiting, token refresh/logout, unhandled rejection resilience (`US-13` - 2 pts).
  - **Member 3 (Database):** Database indexing review, query execution plan analysis (`EXPLAIN ANALYZE`), final migration audit (`US-13` - 2 pts).
  - **Member 4 (QA Lead):** Complete execution of all 20+ test cases, final defect resolution verification, final project report, and master demonstration (`US-13` - 3 pts).
- **Milestone Exit Gate:** 100% test pass rate, complete documentation, tagged GitHub release `v1.0.0-final`.
