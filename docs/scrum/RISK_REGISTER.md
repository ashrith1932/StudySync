# StudySync Comprehensive Risk Register & Management Plan

## 1. Risk Evaluation Matrix

```
       Severity
          ^
Critical  |  [RSK-03: E2E Integration]     [RSK-06: Credential Leak]
High      |  [RSK-01: API Mismatch]        [RSK-02: DB Migration Desync]
Medium    |  [RSK-04: Schedule Conflict]   [RSK-05: Contribution Imbalance]
Low       |  [RSK-07: Scope Creep]         [RSK-08: UI Styling Inconsistency]
          +------------------------------------------------------------> Probability
               Low                              Medium                  High
```

---

## 2. Risk Register & Mitigation Controls

| Risk ID | Risk Title & Description | Category | Impact (1-5) | Likelihood (1-5) | Risk Score | Preventative Action & Mitigation Strategy | Owner | Contingency Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | **API Contract Mismatch:** Frontend team expects different JSON keys or types than Backend provides. | Technical | 4 | 3 | 12 | Standardize all contracts in `docs/api/API_SPECIFICATION.md` before implementation; use shared TypeScript interfaces. | Member 2 & 1 | Daily standup contract check; update mock tests immediately. |
| **RSK-02** | **Database Schema Desync:** Team members apply direct SQL changes locally without migrations. | Technical | 4 | 3 | 12 | Member 3 is designated sole DB gatekeeper. Strict numbered migration scripts (`001_...sql`). | Member 3 | Re-seed clean test database from baseline migrations on build error. |
| **RSK-03** | **Mid-Sem End-to-End Failure:** Sub-modules compile individually but lack complete end-to-end integration. | Project | 5 | 2 | 10 | Mandate Increment 1 integration checkpoint 5 days prior to Mid-Sem evaluation; mock missing endpoints. | Member 4 | Freeze feature development to stabilize core Register $\rightarrow$ Group flow. |
| **RSK-04** | **Scheduling Conflict False Negatives:** Algorithm fails to flag session overlaps across attendees. | Technical | 3 | 3 | 9 | Implement rigorous unit tests for adjacent intervals, full overlaps, and partial bounds (`TC-014`). | Member 4 | Fallback to strict start/end time boundary validation. |
| **RSK-05** | **Unequal Contribution Imbalance:** Commit distribution skewed, risking course penalty under Section 1. | Governance | 4 | 2 | 8 | Granular task allocation matrix; enforce weekly contribution logs and PR peer review rotations. | All Members | Rebalance remaining sprint backlog stories during sprint planning. |
| **RSK-06** | **Credential & Secret Leak:** Accidentally pushing database passwords or JWT secrets to GitHub. | Security | 5 | 1 | 5 | Strict `.gitignore` rules; enforce `.env.example`; run pre-commit scanner for secret strings. | Member 2 | Immediate token rotation and git repository purge via BFG Repo-Cleaner. |
| **RSK-07** | **Feature Scope Creep:** Attempting real-time video/chat instead of core scheduling and matching. | Scope | 3 | 2 | 6 | Strictly enforce exclusions in SRS (Section 2.2); focus only on evaluative syllabus features. | Member 4 | Defer non-critical user stories to post-v1 backlog (`US-15`). |
