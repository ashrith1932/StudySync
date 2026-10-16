# StudySync Defect & Bug Tracking Log

**Severity Classification:**
- `S1 - Blocker / Critical`: Application crash, security vulnerability, data loss, or blocked primary workflow.
- `S2 - Major`: Significant feature failure with no immediate workaround.
- `S3 - Minor`: Functional defect with an available workaround; non-critical UI misalignment.
- `S4 - Trivial`: Typo, wording ambiguity, or cosmetic enhancement.

---

## Defect Tracking Register

| Defect ID | Associated TC | Severity | Module | Description & Steps to Reproduce | Identified By | Assigned To | Status | Resolution / Fix Details |
| **DEF-001** | TC-011 | S3 | Matching Engine | Empty student learning goals resulted in NaN when computing Jaccard coefficient union size. | Member 4 | Member 3 | **RESOLVED** | Added `normA.size === 0 || normB.size === 0` guard returning `{ coefficient: 0, intersection: [] }`. |
| **DEF-002** | TC-012 | S3 | Recommendations | Missing Bearer token on `/recommendations/groups` threw unhandled error before auth middleware returned envelope. | Member 4 | Member 2 | **RESOLVED** | Wrapped route with `protect` middleware returning standardized 401 Unauthorized JSON envelope. |

---

## Defect Resolution Workflow
1. **Identification:** When a test fails or bug is discovered, log a new entry with `BUG-xxx`.
2. **Triaging:** Assign severity and allocate to the responsible member in the next daily standup.
3. **Remediation:** Fix implemented on a branch named `fix/BUG-xxx-<title>`.
4. **Verification:** The identifying member or QA lead (Member 4) re-runs the associated test case and verifies resolution before closing the defect.
