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
