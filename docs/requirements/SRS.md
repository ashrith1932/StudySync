# Software Requirements Specification (SRS)
## StudySync — Peer Matching & Collaborative Study Group Platform

**Document Standard:** IEEE Std 830-1998 Adapted  
**Version:** 1.0.0 (Phase 0 Baseline)  
**Status:** Approved for Implementation  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) details the functional and non-functional requirements for **StudySync**, a full-stack web platform facilitating academic peer discovery, group collaboration, conflict-free study session scheduling, and resource sharing.

### 1.2 Scope
StudySync enables university students to:
- Authenticate securely and manage an academic profile detailing majors, learning goals, preferred subjects, and recurring weekly availability.
- Discover and filter peer study groups by course and academic focus.
- Calculate peer/group compatibility using an explainable matching algorithm.
- Submit membership requests with owner approval workflows.
- Coordinate study sessions with automated scheduling overlap detection and calendar views.
- Share study resources, materials, and links.
- Review attendance records and participation history.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS:** Software Requirements Specification
- **RBAC:** Role-Based Access Control
- **JWT:** JSON Web Token
- **3NF:** Third Normal Form (Relational Database Design)
- **RSVP:** Répondez s'il vous plaît (Attendance response status)
- **DoD / DoR:** Definition of Done / Definition of Ready

---

## 2. Overall Description

### 2.1 Product Perspective
StudySync is an independent, responsive three-tier web application consisting of a React client, an Express.js REST API service, and a PostgreSQL relational database.

### 2.2 User Roles & Personas
1. **Unauthenticated Visitor:**
   - Can view the landing page, read about platform features, register, and log in.
2. **Authenticated Student (Standard User):**
   - Can maintain their profile, set availability, browse public groups, request group membership, attend sessions, view the calendar, and access shared resources.
3. **Study Group Owner / Admin:**
   - An authenticated student who creates a study group. Holds management authority to approve/reject membership requests, schedule group sessions, edit group metadata, and upload group resources.
4. **System Administrator:**
   - Platform overseer responsible for system health, subject catalog maintenance, and administrative moderation.

### 2.3 Operating Environment
- **Client:** Modern web browsers supporting ECMAScript 2020+ (Google Chrome 110+, Mozilla Firefox 110+, Apple Safari 16+, Microsoft Edge 110+).
- **Server:** Node.js 18+ LTS runtime environment on Linux/Windows/macOS.
- **Database:** PostgreSQL 14+ engine.

---

## 3. Specific Requirements

### 3.1 Functional Requirements (FR)

#### Module 1: Authentication & User Profiles
- **FR-001 (Registration):** The system shall allow a student to register with a valid institutional email, full name, and strong password (min 8 chars, 1 uppercase, 1 number, 1 special character).
- **FR-002 (Authentication):** The system shall authenticate registered users via JWT tokens, issuing a stateless signed token valid for 24 hours upon successful credential verification.
- **FR-003 (Password Security):** The system shall hash all passwords using `bcrypt` (cost factor 10) prior to persistence.
- **FR-004 (Profile Setup):** The system shall allow students to record their major, academic year, bio, and learning goals.
- **FR-005 (Availability Specification):** The system shall allow students to define recurring weekly availability slots specifying `dayOfWeek`, `startTime`, and `endTime`.

#### Module 2: Study Group Discovery & Membership
- **FR-006 (Group Creation):** The system shall allow an authenticated student to create a study group by specifying name, description, subject, maximum member capacity ($2 \le n \le 50$), and visibility (`public` or `private`).
- **FR-007 (Group Directory & Search):** The system shall allow students to browse, search, and filter public study groups by subject code, subject name, and tags with pagination support.
- **FR-008 (Join Request Workflow):** The system shall allow students to submit a membership join request with an optional note to a study group.
- **FR-009 (Membership Approval):** The system shall permit the group owner/admin to approve or reject pending membership requests.
- **FR-010 (Capacity Enforcement):** The system shall automatically reject or disable join requests when a group reaches its maximum capacity limit.

#### Module 3: Peer & Group Matching Engine
- **FR-011 (Compatibility Calculation):** The system shall calculate an explainable compatibility score ($0–100\%$) between a student and a study group based on:
  - Subject Match Weight: 40%
  - Schedule Availability Overlap: 40%
  - Learning Goals Semantic/Keyword Overlap: 20%
- **FR-012 (Peer Recommendations):** The system shall present recommended study groups ranked in descending order of compatibility score.

#### Module 4: Study Session Scheduling & Calendar
- **FR-013 (Session Scheduling):** The system shall permit group owners/admins to create study sessions with title, description, start time, end time, location type (`online` or `in_person`), and meeting link/venue.
- **FR-014 (Time Interval Validation):** The system shall validate that `endTime` is strictly greater than `startTime`, and that sessions cannot be scheduled in the past.
- **FR-015 (Conflict & Overlap Guard):** The system shall detect and warn when a newly scheduled session conflicts with existing scheduled sessions of enrolled members.
- **FR-016 (Calendar View):** The system shall display scheduled study sessions in a calendar and list format filtered by month, week, or day.
- **FR-017 (RSVP Tracking):** The system shall allow enrolled group members to set their attendance status (`attending`, `declined`, `tentative`).
- **FR-018 (Attendance Check-In):** The system shall allow session hosts or attendees to record verified attendance check-ins during the session window.

#### Module 5: Shared Study Resources
- **FR-019 (Resource Sharing):** The system shall allow group members to share study resources (links, document URLs, markdown notes, code snippets) categorized by group.
- **FR-020 (Resource Metadata & Access Control):** The system shall restrict resource view and download access to authenticated members of the associated study group.

---

### 3.2 Non-Functional Requirements (NFR)

#### Performance & Scalability
- **NFR-001 (Response Time):** 95% of standard read API requests (group search, profile view) shall respond within 200 ms under a concurrent load of 50 active users.
- **NFR-002 (Database Connection Pooling):** The backend shall utilize connection pooling (minimum 2, maximum 10 active connections) to handle concurrent query spikes gracefully.

#### Security & Privacy
- **NFR-003 (Credential Confidentiality):** Passwords shall never be transmitted in cleartext, returned in API responses, or written to system logs.
- **NFR-004 (Input Sanitization & Injection Defense):** All SQL interactions shall use parameterized queries via the `pg` driver to prevent SQL injection.
- **NFR-005 (Schema Validation):** All incoming HTTP request payloads shall undergo strict runtime validation using Zod before reaching business logic.
- **NFR-006 (Role-Based Authorization):** All protected endpoints shall verify user identity and enforce ownership/membership permissions.

#### Usability & Accessibility
- **NFR-007 (Responsive Design):** The user interface shall adapt smoothly across screen resolutions from 360px (mobile) to 1920px (desktop monitors).
- **NFR-008 (User Feedback):** All asynchronous user operations shall display clear loading states, validation error alerts, or positive success notifications.

#### Maintainability & Reliability
- **NFR-009 (Traceability):** 100% of functional requirements shall map to corresponding unit or integration test cases.
- **NFR-010 (Error Resilience):** The backend shall use a centralized error handler ensuring unhandled exceptions produce clean JSON `500` envelopes without terminating the Node.js process.
