# StudySync Database Architecture & Schema Documentation

## 1. Overview
The StudySync persistence tier is built on PostgreSQL 14+, designed in Third Normal Form (3NF) to ensure data integrity, eliminate redundancy, and support high concurrency.

## 2. Entity Relational Summary
| Table Name | Primary Key | Description | Foreign Keys / Constraints |
| :--- | :--- | :--- | :--- |
| `users` | `id` (UUID) | System credentials and account status | `email` UNIQUE, `role` CHECK |
| `subjects` | `id` (UUID) | Academic courses catalogue | `code` UNIQUE |
| `user_profiles` | `id` (UUID) | Student profile, goals, availability | FK `users(id)` ON DELETE CASCADE (1-to-1) |
| `study_groups` | `id` (UUID) | Study groups created by students | FK `subjects(id)`, FK `users(id)` |
| `group_memberships`| `id` (UUID) | Enrollment status and roles | FK `study_groups(id)`, FK `users(id)`, UNIQUE(`group_id`, `user_id`) |
| `study_sessions` | `id` (UUID) | Meetings and calendar events | FK `study_groups(id)`, FK `users(id)`, CHECK(`end_time` > `start_time`) |
| `session_attendees`| `id` (UUID) | RSVP and attendance tracking | FK `study_sessions(id)`, FK `users(id)`, UNIQUE(`session_id`, `user_id`) |
| `study_resources` | `id` (UUID) | Shared materials and links | FK `study_groups(id)`, FK `users(id)` |

## 3. Indexing Strategy
- B-Tree indexes on all foreign keys (`user_id`, `group_id`, `subject_id`, `creator_id`, `session_id`) to optimize joins.
- Unique B-Tree indexes on `users(email)`, `subjects(code)`, `group_memberships(group_id, user_id)`, `session_attendees(session_id, user_id)`.
- Composite Index on `study_sessions(start_time, end_time)` for fast calendar overlap detection and range queries.
- GIN index on `user_profiles.availability` (JSONB) to accelerate schedule-matching queries.

## 4. Migration Ownership & Rules
- **Member 3 (Database & Peer Matching)** is the primary owner and gatekeeper of all database migrations.
- Direct schema alterations on shared databases without committed `.sql` migrations are strictly prohibited.
- All migrations must be idempotent, reversible where practical, and committed under `database/migrations/`.
