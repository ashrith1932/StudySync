# Requirements Traceability Matrix (RTM)

## 1. Traceability Overview
The Requirements Traceability Matrix guarantees forward and backward accountability across the complete engineering lifecycle:
$$\text{Requirement ID} \longleftrightarrow \text{SRS Reference} \longleftrightarrow \text{Design / Diagram} \longleftrightarrow \text{API Endpoint} \longleftrightarrow \text{Database Table} \longleftrightarrow \text{Test Case ID} \longleftrightarrow \text{Owner}$$

---

## 2. Master Traceability Register

| Req ID | Description | SRS Section | Architecture / Diagram | API Endpoint | DB Table | Test Case ID | Member | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | Student Registration | SRS 3.1.1 | `system_architecture.mermaid` | `POST /api/v1/auth/register` | `users` | `TC-001`, `TC-002` | Member 2 | Planned (Sprint 1) |
| **FR-002** | JWT Login & Auth | SRS 3.1.1 | `sequence_diagrams.mermaid` | `POST /api/v1/auth/login` | `users` | `TC-003`, `TC-004` | Member 2 | Planned (Sprint 1) |
| **FR-003** | Password Hashing (bcrypt) | SRS 3.1.1 | `system_architecture.mermaid` | `POST /api/v1/auth/register` | `users` | `TC-017` | Member 2 | Planned (Sprint 1) |
| **FR-004** | Profile Setup | SRS 3.1.1 | `er_diagram.mermaid` | `PUT /api/v1/users/profile` | `user_profiles` | `TC-005` | Member 2 / 1 | Planned (Sprint 1) |
| **FR-005** | Availability Specification| SRS 3.1.1 | `er_diagram.mermaid` | `PUT /api/v1/users/availability`| `user_profiles` | `TC-005` | Member 2 / 1 | Planned (Sprint 1) |
| **FR-006** | Study Group Creation | SRS 3.1.2 | `use_case_diagram.mermaid` | `POST /api/v1/groups` | `study_groups` | `TC-006`, `TC-007` | Member 3 / 2 | Planned (Sprint 1) |
| **FR-007** | Group Directory & Search | SRS 3.1.2 | `use_case_diagram.mermaid` | `GET /api/v1/groups` | `study_groups` | `TC-008` | Member 1 / 3 | Planned (Sprint 1) |
| **FR-008** | Join Request Submission | SRS 3.1.2 | `sequence_diagrams.mermaid` | `POST /api/v1/groups/:id/join` | `group_memberships` | `TC-009` | Member 3 / 2 | Planned (Sprint 2) |
| **FR-009** | Membership Approval | SRS 3.1.2 | `sequence_diagrams.mermaid` | `PATCH /api/v1/groups/:id/members/:uid` | `group_memberships` | `TC-010` | Member 3 / 2 | Planned (Sprint 2) |
| **FR-010** | Capacity Enforcement | SRS 3.1.2 | `activity_diagram.mermaid` | `POST /api/v1/groups/:id/join` | `study_groups` | `TC-007` | Member 3 | Planned (Sprint 2) |
| **FR-011** | Compatibility Matching | SRS 3.1.3 | `system_architecture.mermaid` | `GET /api/v1/groups/recommendations` | `study_groups`, `user_profiles` | `TC-011`, `TC-012` | Member 3 | Planned (Sprint 2) |
| **FR-012** | Peer Recommendations | SRS 3.1.3 | `use_case_diagram.mermaid` | `GET /api/v1/groups/recommendations` | `study_groups` | `TC-012` | Member 3 / 1 | Planned (Sprint 3) |
| **FR-013** | Session Scheduling | SRS 3.1.4 | `activity_diagram.mermaid` | `POST /api/v1/groups/:id/sessions` | `study_sessions` | `TC-013` | Member 4 | Planned (Sprint 3) |
| **FR-014** | Time Boundary Validation | SRS 3.1.4 | `activity_diagram.mermaid` | `POST /api/v1/groups/:id/sessions` | `study_sessions` | `TC-014` | Member 4 | Planned (Sprint 3) |
| **FR-015** | Conflict / Overlap Guard | SRS 3.1.4 | `activity_diagram.mermaid` | `POST /api/v1/groups/:id/sessions` | `study_sessions` | `TC-014` | Member 4 | Planned (Sprint 3) |
| **FR-016** | Calendar View | SRS 3.1.4 | `use_case_diagram.mermaid` | `GET /api/v1/sessions/calendar` | `study_sessions` | `TC-013` | Member 1 / 4 | Planned (Sprint 3) |
| **FR-017** | Attendance RSVP | SRS 3.1.4 | `er_diagram.mermaid` | `PATCH /api/v1/sessions/:id/rsvp` | `session_attendees` | `TC-015` | Member 4 | Planned (Sprint 3) |
| **FR-018** | Attendance Check-in | SRS 3.1.4 | `er_diagram.mermaid` | `POST /api/v1/sessions/:id/checkin` | `session_attendees` | `TC-015` | Member 4 | Planned (Sprint 3) |
| **FR-019** | Resource Sharing | SRS 3.1.5 | `er_diagram.mermaid` | `POST /api/v1/groups/:id/resources`| `study_resources` | `TC-016` | Member 4 | Planned (Sprint 3) |
| **FR-020** | Resource Access Control | SRS 3.1.5 | `system_architecture.mermaid` | `GET /api/v1/groups/:id/resources` | `study_resources` | `TC-016` | Member 4 | Planned (Sprint 3) |

---

## 3. Non-Functional Traceability Register

| NFR ID | Category | Target Metric | Verification Method | Associated Test Case | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **NFR-001** | Security | Hashed passwords via bcrypt 10 | Automated API unit test on DB record | `TC-017` | Member 2 |
| **NFR-002** | Performance | Search response < 200 ms | Artillery/K6 or benchmark timer | `TC-018` | Member 3 |
| **NFR-003** | Usability | Responsive down to 360px viewport | Browser viewport test & screenshot | `TC-019` | Member 1 |
| **NFR-004** | Integrity | Zero orphan rows on deletion (CASCADE) | Relational integration test script | `TC-020` | Member 3 |
| **NFR-005** | Reliability | Centralized error recovery without crash | Chaos payload injection test | `TC-002`, `TC-014` | Member 2 |
