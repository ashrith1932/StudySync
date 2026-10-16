# Implementation Prompt for Member 1: Frontend & UI/UX Specialist

**Role:** Member 1 — Frontend & UI/UX Engineer  
**Assigned Scope:** React Client Application, Tailwind CSS Design System, Responsive Views, Client-side State, API Service Integration, Frontend Testing.  
**Branch Prefix:** `feature/frontend-*`  
**Target Milestone:** Increments 1, 2, 3, 4 (Phased by Sprint)  

---

## 1. Context & Operational Constraints
You are implementing the frontend presentation tier for **StudySync**, a collaborative study-group platform.
Before writing or modifying any code, you MUST:
1. Inspect the authoritative shared documents:
   - Shared Types: `frontend/src/types/index.ts`
   - API Specification: `docs/api/API_SPECIFICATION.md`
   - System Architecture: `docs/architecture/SYSTEM_ARCHITECTURE.md`
   - Project Master Plan: `docs/PROJECT_PLAN.md`
2. **STRICT PROHIBITION:** You MUST NOT alter API routes, payload structures, backend source code (`backend/`), database migrations (`database/`), or shared TypeScript contracts unilaterally. If an API contract discrepancy arises, flag it to Member 2 and Member 3.

---

## 2. Permitted Working Directory
- You work strictly within `frontend/` and documentation templates in `docs/`.
- Permitted files to create/edit:
  - `frontend/src/components/*` (Reusable atomic and composite UI widgets)
  - `frontend/src/pages/*` (Route views: Login, Register, Dashboard, GroupDetail, Calendar, Profile)
  - `frontend/src/layouts/*` (Navbar, AppLayout, AuthLayout)
  - `frontend/src/services/*` (Axios API wrappers consuming `/api/v1/*`)
  - `frontend/src/context/*` (AuthContext, ToastContext)
  - `frontend/src/hooks/*` (Custom hooks: useAuth, useGroups, useSessions)
  - `frontend/tests/*` (Vitest and React Testing Library specs)

---

## 3. Detailed Deliverables by Sprint

### Sprint 1 Deliverables (Foundation & Increment 1)
- [ ] Initialize Tailwind design tokens and layout shells (`Navbar`, `Sidebar`, `AuthLayout`).
- [ ] Implement `AuthContext` to manage JWT tokens in memory/localStorage and user session state.
- [ ] Implement `LoginPage` and `RegisterPage` with client-side form validation (email format, password length).
- [ ] Implement `ProfileSetupPage` allowing input of bio, major, academic year, and weekly recurring availability slots (using `DayTimeSlot` model).
- [ ] Implement `GroupListPage` and `GroupCard` displaying available study groups with search and subject filtering.
- [ ] Implement `CreateGroupModal` with name, description, subject selection, and member limit input.

### Sprint 2 Deliverables (Membership & Mid-Sem End-to-End Release)
- [ ] Implement `GroupDetailPage` showing group roster, member count, owner badge, and tags.
- [ ] Implement "Request to Join" modal with note submission for students.
- [ ] Implement Owner Management View: Tab showing pending membership requests with "Approve" / "Reject" actions.
- [ ] Implement `RecommendationsView`: Display recommended study groups ranked with visual compatibility badges (e.g. "88% Match").
- [ ] Verify End-to-End flow on local environment for the Mid-Semester evaluation demo.

### Sprint 3 Deliverables (Scheduling & Resources)
- [ ] Implement `CalendarView` (Monthly and Weekly views) displaying scheduled study sessions.
- [ ] Implement `SessionModal`: Allows owners to schedule sessions (date, time, venue/link); displays conflict alerts.
- [ ] Implement RSVP buttons (`Attending`, `Declined`, `Tentative`) on session cards.
- [ ] Implement `ResourcesTab`: Group file/link sharing list with upload/link submission modal.

### Sprint 4 Deliverables (Polish & Quality)
- [ ] Responsive design audit across mobile (360px+), tablet (768px), and desktop (1200px+).
- [ ] Implement accessible loading spinners, skeleton screens, and toast alert banners.
- [ ] Component unit and integration tests covering form inputs, auth state changes, and error renders.

---

## 4. UI/UX & Architectural Guidelines
- **Color Palette:** Professional academic indigo/slate (`brand` palette defined in `tailwind.config.js`).
- **Responsive Standard:** Mobile-first approach. Ensure tables collapse or scroll horizontally, and navigation collapses into a hamburger menu on small viewports.
- **State Handling:** Every network request must cleanly handle 4 distinct states:
  1. `idle`
  2. `loading` (spinner / disabled buttons)
  3. `error` (visible error banner displaying API error message)
  4. `success` (toast notification or redirect)
- **API Client:** All requests must route through `frontend/src/services/api.ts` with standard Axios interceptors attaching `Authorization: Bearer <token>`.

---

## 5. Verification, Evidence & Acceptance Criteria
- Code must compile with zero TypeScript errors (`npm run build`).
- Frontend unit tests must pass cleanly (`npm run test`).
- Capture screenshots of responsive views, loading states, and error alerts into `docs/testing/evidence/`.
- Update `docs/scrum/CONTRIBUTION_RECORD.md` with your weekly progress and commit SHAs.
- Never mark a feature complete without live verification against the running backend.
