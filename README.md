# StudySync

> **A Full-Stack Peer-Matching & Collaborative Study-Group Platform**  
> Developed for the Software Engineering & Project Management (SEPM) Course by a Four-Member Team.

---

## 1. Project Overview

**StudySync** is designed to solve the challenges university students face when attempting to discover course-relevant study partners and maintain structured, accountable study groups.

### Core Capabilities
- **Student Authentication & Academic Profiles:** Secure JWT registration/login, academic major, learning goals, and recurring weekly schedule availability slots.
- **Study-Group Discovery & Management:** Public/private group creation, course catalog tagging, capacity limits ($2 \le n \le 50$), directory search, and filtering.
- **Explainable Peer Matching:** Multi-criteria compatibility scoring considering course subjects (40%), schedule availability overlap (40%), and learning goals (20%).
- **Membership Request Workflow:** Student join requests with notes, group owner approval/rejection dashboard, and roster management.
- **Conflict-Free Session Scheduling:** Study session creation, date/time boundaries, automated conflict detection against member schedules, and interactive calendar views.
- **Shared Study Resources:** Group-level document, link, and notes repository with member-only access control.
- **Attendance & Participation Tracking:** RSVP status (`attending`, `declined`, `tentative`) and verified session check-ins.

---

## 2. Technology Stack

| Layer | Technologies | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, TypeScript, React Router v6, Axios | Rapid build times, responsive utility-first styling, full type-safety matching backend API contracts. |
| **Backend** | Node.js 18+ LTS, Express 4.x (ESM), Zod, bcryptjs, jsonwebtoken | Lightweight asynchronous REST API service, strong runtime schema validation, secure password hashing. |
| **Database** | PostgreSQL 14+, `pg` Connection Pool | 3NF relational design, ACID transactions, native JSONB support with GIN indexes for student availability schedules. |
| **Testing** | Vitest, React Testing Library, Jest, Supertest | Comprehensive pyramid testing covering unit, integration, API, and end-to-end workflows. |
| **Version Control & SEPM** | Git, GitHub, Agile Scrum, Incremental Development Model | Staged functional delivery, pull-request peer reviews, and complete requirements traceability. |

---

## 3. Repository Structure

```text
StudySync/
├── frontend/                     # React 18 + Vite + Tailwind CSS SPA
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Visual assets and styling
│   │   ├── components/           # Reusable UI widgets
│   │   ├── pages/                # Route page views
│   │   ├── layouts/              # Navbar, Sidebar, and App shells
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # Axios API service client wrappers
│   │   ├── context/              # React Context (AuthContext)
│   │   ├── utils/                # Helper utilities
│   │   ├── types/                # Authoritative TypeScript data contracts
│   │   └── main.tsx              # Application mount placeholder
│   ├── tests/                    # Frontend Vitest test suites
│   ├── package.json              # Frontend manifest & scripts
│   ├── tsconfig.json             # TypeScript compiler settings
│   ├── vite.config.ts            # Vite build and proxy config
│   └── tailwind.config.js        # Tailwind design tokens
├── backend/                      # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/               # Environment & DB connection setup
│   │   ├── controllers/          # HTTP request handlers
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Core business logic & algorithms
│   │   ├── repositories/         # Database access layer (SQL)
│   │   ├── middleware/           # Auth, RBAC, error handling middleware
│   │   ├── validators/           # Zod schema validation rules
│   │   ├── utils/                # Password, token, and response helpers
│   │   └── app.js                # Express app entrypoint placeholder
│   ├── tests/                    # Supertest API integration suites
│   └── package.json              # Backend manifest & dependencies
├── database/                     # PostgreSQL Migrations & Seeds
│   ├── migrations/               # Numbered SQL DDL migrations (001_initial_schema.sql)
│   ├── seeds/                    # Sample test data (001_sample_seed.sql)
│   ├── schema/                   # Schema documentation & indexing strategy
│   └── README.md                 # Database setup and execution guide
├── docs/                         # SEPM Documentation & Course Deliverables
│   ├── PROJECT_PLAN.md           # Master SEPM project plan & methodology
│   ├── requirements/             # IEEE SRS and Traceability Matrix
│   ├── architecture/             # Three-tier system architecture specification
│   ├── api/                      # Authoritative REST API contracts
│   ├── database/                 # Database data dictionary
│   ├── testing/                  # Master test plan, test cases, defect log
│   ├── scrum/                    # Sprint plan, backlog, meeting & contribution logs
│   ├── diagrams/                 # UML & Architecture diagrams (Mermaid source)
│   ├── reports/                  # Mid-Sem report template, AI disclosure, ZIP spec
│   └── prompts/                  # Four copy-ready implementation prompts
├── DEMO_VIDEO_LINK.txt           # Mid-Sem 5-7 min demonstration video link
├── .env.example                  # Environment configuration template (NO SECRETS)
├── .gitignore                    # Git ignore rules for node, dist, logs, env
└── README.md                     # Project documentation overview (this file)
```

---

## 4. Four-Member Team Responsibility Matrix

| Member | Student Name & Reg. No. | Primary Role | Core Modules & Deliverables | Planned Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | **Yadavalli Sumanth Chowdary** (20243322) | **Frontend & UI/UX** | React UI, Tailwind design system, Client-side routing, API integration, Form validation, Responsive layouts, Vitest component tests. | 25% |
| **Member 2** | **Vuppalapanchu Karthikeya Lalith** (20243321) | **Backend & Authentication** | Express architecture, JWT auth, RBAC middleware, bcrypt password hashing, Zod validation, Error handling, Supertest API tests. | 25% |
| **Member 3** | **Vem Nagarjuna Reddy** (20243315) | **Database & Matching** | PostgreSQL 3NF schema, SQL migrations, Seed data, Data Dictionary, ER modeling, Heuristic peer matching algorithm. | 25% |
| **Member 4** | **Tummala Ashrith Reddy** (20243297) | **Scheduling, Resources & QA** | Study session scheduling, Overlap detection heuristics, Attendance RSVP & check-in, Shared resources, Test cases, Traceability, Demo lead. | 25% |

---

## 5. Development Increments & Milestones

- **Phase 0: Planning & Architecture (Current Phase)**
  - Course PDF analysis, IEEE SRS, 3NF database schema, REST API contracts, repository scaffolding.
  - *Strict rule: Zero application code implemented during Phase 0.*
- **Increment 1: Foundation (Sprint 1)**
  - JWT Authentication, Student Profile setup, Subject catalog, Study Group creation and search.
- **Increment 2: Membership & Matching (Sprint 2 - Mid-Semester Milestone: 50%)**
  - Join requests, Owner approvals, Capacity guards, Baseline compatibility matching.
  - **Mid-Semester Evaluation Gate:** Complete working end-to-end user journey, 10–15 page report, and 5–7 min demo video.
- **Increment 3: Scheduling & Resources (Sprint 3)**
  - Session scheduling with conflict detection, Calendar views, Attendance RSVP, Shared resource uploads.
- **Increment 4: Quality & Release (Sprint 4 - Final Milestone: 100%)**
  - End-to-end regression testing, security hardening, final documentation, final demonstration.

---

## 6. Getting Started (Local Environment Setup)

### Prerequisites
- Node.js 18+ LTS and `npm` installed.
- PostgreSQL 14+ installed and running.

### Step 1: Clone the Repository
```bash
git clone https://github.com/ashrith1932/StudySync.git
cd StudySync
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in both `backend/` and `frontend/`:
```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
```
*(Verify database credentials in `backend/.env` match your local PostgreSQL configuration).*

### Step 3: Initialize PostgreSQL Database
```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE studysync_db;"
psql -U postgres -c "CREATE USER studysync_user WITH ENCRYPTED PASSWORD 'studysync_dev_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE studysync_db TO studysync_user;"

# Run schema migrations and load sample seeds
psql -U studysync_user -d studysync_db -f database/migrations/001_initial_schema.sql
psql -U studysync_user -d studysync_db -f database/seeds/001_sample_seed.sql
```

### Step 4: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 5: Run Development Servers
```bash
# Start Backend REST API Server (Port 5000)
cd backend
npm run dev

# In a separate terminal, start Frontend Vite Dev Server (Port 5173)
cd frontend
npm run dev
```

---

## 7. Mid-Semester Evaluation Compliance Checklist

Per the Course Mid-Semester Evaluation PDF, the submission package requires:
- [x] **40–60% Progress Target:** Targeted at 50% via Increment 1 & 2 baseline.
- [x] **Working End-to-End Feature:** Full registration $\rightarrow$ profile setup $\rightarrow$ group creation $\rightarrow$ search $\rightarrow$ join workflow.
- [x] **Mid-Semester Project Report (10–15 pages):** Structured template adhering to the 16 required sections in `docs/reports/MIDSEM_REPORT_TEMPLATE.md`.
- [x] **Software Requirements Specification (SRS):** IEEE 830 compliant in `docs/requirements/SRS.md`.
- [x] **Requirements Traceability Matrix:** Maintained in `docs/requirements/TRACEABILITY_MATRIX.md`.
- [x] **System Architecture & UML Diagrams:** Available in `docs/diagrams/` (Architecture, Use-Case, ER, Sequence, Activity).
- [x] **Test Cases & Pass/Fail Register:** Formatted per Section 11 in `docs/testing/TEST_CASES.md`.
- [x] **Demonstration Video Link:** Formatted per Section 3.D in `DEMO_VIDEO_LINK.txt`.
- [x] **Academic Integrity & AI Disclosure:** Disclosed per Section 6 in `docs/reports/AI_USAGE_DISCLOSURE.md`.
- [x] **Moodle ZIP Structure:** Packaged as `Section_GroupNumber_StudySync_MidSem.zip` per `docs/reports/SUBMISSION_ZIP_SPEC.md`.

---

## 8. Collaboration & Contribution Guidelines

1. **Contract Immutability:** Never modify shared API contracts (`docs/api/API_SPECIFICATION.md`) or database schemas unilaterally.
2. **Migration Discipline:** All database changes must be versioned via numbered scripts in `database/migrations/`.
3. **Traceability:** Every pull request must cite its corresponding Requirement ID (`FR-xxx`) and Test Case ID (`TC-xxx`).
4. **Peer Review:** Direct pushes to `main` or `develop` are prohibited; all PRs require at least one peer approval.
5. **No Secrets:** Never commit real passwords, tokens, or private environment files to Git.