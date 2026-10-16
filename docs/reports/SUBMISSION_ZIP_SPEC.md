# Course Submission ZIP Packaging Specification

**Standard:** Course Mid-Semester Evaluation PDF Section 4 & 5 Compliant  
**Package Naming Convention:** `[Section]_[GroupNumber]_StudySync_MidSem.zip`  
*(Example: `A_Group05_StudySync_MidSem.zip`)*  

---

## Required ZIP Hierarchy & File Mapping

```text
Section_GroupXX_StudySync_MidSem.zip/
│
├── 01_Report/
│   └── MidSem_Project_Report.pdf          <-- Exported from docs/reports/MIDSEM_REPORT_TEMPLATE.md
│
├── 02_Requirements/
│   ├── SRS.pdf                            <-- Exported from docs/requirements/SRS.md
│   └── Use_Cases_or_User_Stories.pdf      <-- Exported from docs/diagrams/use_case_descriptions.md
│
├── 03_Design/
│   ├── Architecture_Diagram.pdf           <-- Exported from docs/diagrams/system_architecture.mermaid
│   ├── Database_Design.pdf                <-- Exported from docs/database/DATA_DICTIONARY.md & er_diagram.mermaid
│   └── UML_Diagrams.pdf                   <-- Exported from docs/diagrams/sequence_diagrams.mermaid & activity_diagram.mermaid
│
├── 04_Source_Code/
│   ├── README.md                          <-- Root README.md
│   ├── frontend/                          <-- frontend/ source tree (excluding node_modules/ & dist/)
│   ├── backend/                           <-- backend/ source tree (excluding node_modules/)
│   ├── database/                          <-- database/ migrations/ and seeds/
│   └── .env.example                       <-- Safe configuration template (NO SECRETS)
│
├── 05_Testing/
│   ├── Test_Cases.pdf                     <-- Exported from docs/testing/TEST_CASES.md & TEST_PLAN.md
│   └── Test_Evidence/                     <-- Directory containing automated test run screenshots & logs
│
├── 06_Project_Management/
│   ├── Project_Plan.pdf                   <-- Exported from docs/PROJECT_PLAN.md & SPRINT_PLAN.md
│   ├── Meeting_Log.pdf                    <-- Exported from docs/scrum/MEETING_LOG.md
│   ├── Contribution_Record.pdf            <-- Exported from docs/scrum/CONTRIBUTION_RECORD.md
│   └── Risk_Register.pdf                  <-- Exported from docs/scrum/RISK_REGISTER.md
│
└── 07_Demo/
    └── DEMO_VIDEO_LINK.txt                <-- Accessible view-only link to the 5–7 min video
```

---

## Verification Before ZIP Packaging
1. Ensure no `node_modules` or `dist` folders are included (these inflate ZIP size).
2. Ensure no `.env` files with private secrets or passwords are included.
3. Test that the created ZIP uncompresses cleanly on another machine.
