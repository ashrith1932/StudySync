# StudySync Test Case Register & Execution Log

**Template Standard:** Course Evaluation Section 3.C & 11 Compliant  
**Status Legend:**  
- `PLANNED`: Defined in Phase 0, scheduled for upcoming sprint execution.  
- `IN_PROGRESS`: Currently being tested by the assigned member.  
- `PASS`: Executed and verified against expected behavior.  
- `FAIL`: Execution failed; linked to Defect Log ID.  

> [!NOTE]
> Per Course Academic Integrity Guidelines, actual test results and screenshot paths are to be recorded upon physical execution in the corresponding sprint. No fabricated test results are recorded here.

---

## Master Test Case Table

| Test Case ID | Req ID | Feature / Module | Test Type | Input / Precondition | Expected Result | Actual Result | Status | Verified By |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-001** | FR-001 | User Registration | Positive Integration | Valid email `new@uni.edu`, valid password `Secure123!`, full name | HTTP 201 Created; returns user ID & JWT token; user in DB | *Pending Execution* | PLANNED (Sprint 1) | Member 2 |
| **TC-002** | FR-001 | User Registration | Negative Validation | Malformed email `invalid-email`, short password `abc` | HTTP 400 Bad Request; field-level error messages in envelope | *Pending Execution* | PLANNED (Sprint 1) | Member 2 |
| **TC-003** | FR-002 | User Login | Positive Integration | Correct email and password | HTTP 200 OK; returns signed JWT token with 24h expiry | *Pending Execution* | PLANNED (Sprint 1) | Member 2 |
| **TC-004** | FR-002 | User Login | Negative Security | Correct email with incorrect password | HTTP 401 Unauthorized; code `INVALID_CREDENTIALS` | *Pending Execution* | PLANNED (Sprint 1) | Member 2 |
| **TC-005** | FR-004, FR-005 | Profile & Availability | Positive Functional | Bio, major, and weekly availability JSON array | HTTP 200 OK; availability persisted in `user_profiles` | *Pending Execution* | PLANNED (Sprint 1) | Member 2 / 1 |
| **TC-006** | FR-006 | Group Creation | Positive Functional | Valid group name, description, subjectId, maxMembers=6 | HTTP 201 Created; group created; creator assigned `owner` | *Pending Execution* | PLANNED (Sprint 1) | Member 3 / 2 |
| **TC-007** | FR-006, FR-010| Group Creation | Boundary Test | maxMembers = 1 or maxMembers = 51 | HTTP 400 Bad Request; schema validation rejects out-of-range | *Pending Execution* | PLANNED (Sprint 1) | Member 3 |
| **TC-008** | FR-007 | Group Search & Filter | Positive Functional | Query `?search=Architecture&subjectId=CS301` | HTTP 200 OK; returns matching groups with pagination meta | *Pending Execution* | PLANNED (Sprint 1) | Member 1 / 3 |
| **TC-009** | FR-008 | Join Request Submission| Positive Functional | Student requests to join public group with note | HTTP 201 Created; membership status set to `pending` | *Pending Execution* | PLANNED (Sprint 2) | Member 3 / 2 |
| **TC-010** | FR-009 | Membership Approval | Positive Functional | Group owner PATCHes membership status to `accepted` | HTTP 200 OK; status updated to `accepted`; member count +1 | *Pending Execution* | PLANNED (Sprint 2) | Member 3 / 2 |
| **TC-011** | FR-011 | Matching Algorithm | Positive Unit | Student with identical subject, overlapping times, shared goals | Compatibility score $\ge 80\%$; explainable breakdown | *Pending Execution* | PLANNED (Sprint 2) | Member 3 |
| **TC-012** | FR-011 | Matching Algorithm | Boundary Unit | Student with zero subject overlap and disjoint schedule | Compatibility score $< 15\%$; correct breakdown metrics | *Pending Execution* | PLANNED (Sprint 2) | Member 3 |
| **TC-013** | FR-013 | Session Scheduling | Positive Functional | Group owner creates session with future start/end time | HTTP 201 Created; session status `scheduled`; returns ID | *Pending Execution* | PLANNED (Sprint 3) | Member 4 |
| **TC-014** | FR-014 | Time Boundary Validation| Negative Validation | Session endTime $\le$ startTime or startTime in the past | HTTP 400 Bad Request; descriptive boundary error message | *Pending Execution* | PLANNED (Sprint 3) | Member 4 |
| **TC-015** | FR-017, FR-018| RSVP & Check-In | Positive Functional | Member sends RSVP `attending`; checks in during session | HTTP 200 OK; checkInTime timestamp recorded | *Pending Execution* | PLANNED (Sprint 3) | Member 4 |
| **TC-016** | FR-019, FR-020| Resource Sharing | Security / Perms | Non-member attempts to access private group's resources | HTTP 403 Forbidden; code `FORBIDDEN_RESOURCE_ACCESS` | *Pending Execution* | PLANNED (Sprint 3) | Member 4 |
| **TC-017** | NFR-001 | Password Hashing | Security Unit | Direct DB query on `users` table after registration | `password_hash` starts with `$2a$10$`; cleartext absent | *Pending Execution* | PLANNED (Sprint 1) | Member 2 |
| **TC-018** | NFR-002 | Search Performance | Performance Test | 50 concurrent requests to `/api/v1/groups` | 95th percentile latency $< 200\text{ms}$ | *Pending Execution* | PLANNED (Sprint 2) | Member 3 |
| **TC-019** | NFR-003 | Responsive Layout | UI / Usability | Viewport resized to 375px $\times$ 667px (Mobile) | Zero horizontal overflow; navigation menu collapses cleanly | *Pending Execution* | PLANNED (Sprint 1-2) | Member 1 |
| **TC-020** | NFR-004 | Relational Integrity | Database Test | Delete a study group that contains sessions and resources | Cascading deletes remove child sessions and resources cleanly | *Pending Execution* | PLANNED (Sprint 2) | Member 3 |

---

## Evidence Capture Protocol
During Sprint execution, each passing test must be substantiated with:
1. Automated CLI test output screenshot or terminal log saved in `docs/testing/evidence/`.
2. UI workflow screenshots captured from the running browser application.
3. Test case table updated with actual timestamp, execution result, and reviewer signature.
