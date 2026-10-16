# StudySync Master Test Plan & Quality Strategy

**Document Version:** 1.0.0  
**Testing Frameworks:** Vitest & React Testing Library (Frontend), Jest & Supertest (Backend), PostgreSQL Verification Scripts (Database)  

---

## 1. Testing Objectives
The primary goal of testing in StudySync is to ensure functional correctness, data integrity, security resilience, and responsiveness, while maintaining 100% traceability to user requirements in compliance with Course Evaluation criteria.

---

## 2. Test Levels & Strategy

```
           / \
          /   \         End-to-End Tests (Cypress / Playwright or Manual User Journeys)
         /-----\        - Complete registration -> group creation -> join request -> session flow
        /       \
       / Integration \  API Integration Tests (Jest + Supertest)
      /   Testing     \ - Controller -> Service -> DB Repository verification
     /-----------------\
    /   Unit Testing    \ Unit Tests (Vitest & Jest)
   /                     \ - Component rendering, password hashing, matching math, date conflict logic
  +-----------------------+
```

### 2.1 Unit Testing
- **Frontend Components:** Rendering with mocked props, user event firing, form validation states, empty & error states.
- **Backend Services:** Isolated business logic tests (matching compatibility formula, session conflict detection algorithms, Zod schema rules).

### 2.2 Integration & API Testing
- Supertest calls against Express routes connected to a dedicated test PostgreSQL database.
- Verifies HTTP status codes, standard JSON envelope structure, database transactions, cascading deletes, and token authorization.

### 2.3 System & Acceptance Testing (UAT)
- Validates the complete user workflow required for the Mid-Semester evaluation in `tests/system_acceptance.test.js`:
  1. Student creates an account (Registration & JWT issuance).
  2. Sets up profile, academic major, and weekly recurring availability slots.
  3. Creates a new study group and auto-enrolls as owner.
  4. Second student searches and receives algorithmic recommendation with compatibility score.
  5. Second student applies to join with an introductory note.
  6. Creator reviews pending requests with hydrated student profile and approves membership.
  7. Membership updates live and capacity limits are enforced.

### 2.4 Regression & System Invariant Testing
- Automated regression suite in `tests/regression.test.js` validating:
  1. Uniform API response envelopes across success and error handlers.
  2. Credential confidentiality (zero password hash leakage).
  3. Query parameter sanitization and injection resistance.
  4. Course catalogue stability and composite unique key integrity.

### 2.5 Security & Boundary Testing
- Testing injection strings in search queries.
- Attempting unauthorized access without JWT token (`401`).
- Attempting session creation with past timestamp or `endTime <= startTime` (`400`).
- Attempting to exceed maximum group capacity ($n > \text{maxMembers}$) (`400`).

---

## 3. Pass/Fail Criteria
- **Unit & Integration Tests:** 100% passing rate required for any branch merge into `develop` or `main`.
- **API Response Envelope:** 100% compliance with standard `{ success, data, error, meta }` format.
- **Zero Critical / Blocker Defects:** No open Severity-1 or Severity-2 defects allowed at release.
