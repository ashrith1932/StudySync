# StudySync Database Data Dictionary

## 1. Overview
This data dictionary details the tables, columns, constraints, data types, nullability, default values, and relational descriptions for the StudySync PostgreSQL 14+ database.

---

## 2. Table Specifications

### 2.1 Table: `users`
Stores student and administrator user credentials and system status.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `uuid_generate_v4()` | PRIMARY KEY | Unique user identifier |
| `email` | `VARCHAR(255)` | No | None | UNIQUE | Institutional email address |
| `password_hash` | `VARCHAR(255)` | No | None | None | Bcrypt hashed password (cost 10) |
| `full_name` | `VARCHAR(150)` | No | None | None | User's legal or preferred name |
| `role` | `VARCHAR(30)` | No | `'student'` | CHECK (`role` IN ('student','admin')) | Access authorization role |
| `is_active` | `BOOLEAN` | No | `TRUE` | None | Account active status flag |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Record creation timestamp (UTC) |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Record update timestamp (UTC) |

---

### 2.2 Table: `subjects`
Stores the academic course taxonomy and catalogue.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `uuid_generate_v4()` | PRIMARY KEY | Unique subject identifier |
| `code` | `VARCHAR(50)` | No | None | UNIQUE | Course code (e.g., 'CS301') |
| `name` | `VARCHAR(255)` | No | None | None | Subject title |
| `department` | `VARCHAR(100)` | Yes | None | None | Academic department offering course |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Record creation timestamp |

---

### 2.3 Table: `user_profiles`
Stores academic preferences, learning goals, and weekly recurring availability.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `uuid_generate_v4()` | PRIMARY KEY | Unique profile identifier |
| `user_id` | `UUID` | No | None | UNIQUE, FK `users(id)` ON DELETE CASCADE | 1-to-1 link to user |
| `bio` | `TEXT` | Yes | None | None | Short student self-introduction |
| `major` | `VARCHAR(150)` | Yes | None | None | Declared degree program / major |
| `academic_year`| `VARCHAR(50)` | Yes | None | None | Academic standing (e.g. '3rd Year')|
| `learning_goals`| `TEXT[]` | Yes | `'{}'` | None | Array of learning objectives |
| `preferred_subjects`| `TEXT[]` | Yes | `'{}'` | None | Array of subject codes |
| `availability` | `JSONB` | No | `'[]'` | GIN INDEX | Array of weekly time slots |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Record update timestamp |

---

### 2.4 Table: `study_groups`
Stores collaborative study groups.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `uuid_generate_v4()` | PRIMARY KEY | Unique group identifier |
| `name` | `VARCHAR(200)` | No | None | None | Group title |
| `description` | `TEXT` | No | None | None | Purpose and meeting agenda |
| `subject_id` | `UUID` | No | None | FK `subjects(id)` ON DELETE RESTRICT | Course focus |
| `creator_id` | `UUID` | No | None | FK `users(id)` ON DELETE RESTRICT | Founding student user |
| `max_members` | `INT` | No | `8` | CHECK ($2 \le \text{max} \le 50$) | Maximum group capacity |
| `visibility` | `VARCHAR(20)` | No | `'public'` | CHECK (`visibility` IN ('public','private')) | Discovery visibility |
| `tags` | `TEXT[]` | Yes | `'{}'` | None | Search and filter tags |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Record update timestamp |

---

### 2.5 Table: `group_memberships`
Tracks student membership status and permissions within a group.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `uuid_generate_v4()` | PRIMARY KEY | Unique membership identifier |
| `group_id` | `UUID` | No | None | FK `study_groups(id)` ON DELETE CASCADE | Associated study group |
| `user_id` | `UUID` | No | None | FK `users(id)` ON DELETE CASCADE | Member student |
| `role` | `VARCHAR(30)` | No | `'member'` | CHECK (`role` IN ('owner','admin','member')) | Group-level role |
| `status` | `VARCHAR(30)` | No | `'pending'` | CHECK (`status` IN ('pending','accepted','rejected','left')) | Membership state |
| `request_note`| `TEXT` | Yes | None | None | Application note from student |
| `joined_at` | `TIMESTAMPTZ` | Yes | None | None | Timestamp when accepted |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Request creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Status update timestamp |

*Composite Unique Constraint:* `UNIQUE(group_id, user_id)`

---

### 2.6 Table: `study_sessions`
Stores scheduled meetings, locations, and time ranges.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `uuid_generate_v4()` | PRIMARY KEY | Unique session identifier |
| `group_id` | `UUID` | No | None | FK `study_groups(id)` ON DELETE CASCADE | Associated study group |
| `title` | `VARCHAR(200)` | No | None | None | Session title / topic |
| `description` | `TEXT` | Yes | None | None | Detailed study plan |
| `start_time` | `TIMESTAMPTZ` | No | None | None | Session start time (UTC) |
| `end_time` | `TIMESTAMPTZ` | No | None | None | Session end time (UTC) |
| `location_type`| `VARCHAR(30)` | No | `'online'` | CHECK (`location_type` IN ('online','in_person')) | Venue format |
| `meeting_link_or_venue` | `TEXT` | No | None | None | URL link or room number |
| `created_by_id`| `UUID` | No | None | FK `users(id)` ON DELETE RESTRICT | Session organizer |
| `status` | `VARCHAR(30)` | No | `'scheduled'` | CHECK (`status` IN ('scheduled','in_progress','completed','cancelled')) | Lifecycle status |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Update timestamp |

*Check Constraint:* `CHECK (end_time > start_time)`

---

### 2.7 Table: `session_attendees`
Tracks student RSVP responses and attendance check-ins.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `uuid_generate_v4()` | PRIMARY KEY | Attendee record ID |
| `session_id` | `UUID` | No | None | FK `study_sessions(id)` ON DELETE CASCADE | Associated session |
| `user_id` | `UUID` | No | None | FK `users(id)` ON DELETE CASCADE | Student attendee |
| `status` | `VARCHAR(30)` | No | `'tentative'` | CHECK (`status` IN ('attending','declined','tentative','attended','absent')) | RSVP / Attendance status |
| `check_in_time`| `TIMESTAMPTZ` | Yes | None | None | Verified check-in timestamp |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Update timestamp |

*Composite Unique Constraint:* `UNIQUE(session_id, user_id)`

---

### 2.8 Table: `study_resources`
Stores documents, links, and notes uploaded to a study group.

| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `uuid_generate_v4()` | PRIMARY KEY | Unique resource identifier |
| `group_id` | `UUID` | No | None | FK `study_groups(id)` ON DELETE CASCADE | Associated study group |
| `title` | `VARCHAR(200)` | No | None | None | Resource title |
| `description` | `TEXT` | Yes | None | None | Contextual description |
| `resource_type`| `VARCHAR(30)` | No | None | CHECK (`resource_type` IN ('document','link','note','code_snippet')) | Content format |
| `resource_uri` | `TEXT` | No | None | None | Web URL or object storage path |
| `uploader_id` | `UUID` | No | None | FK `users(id)` ON DELETE RESTRICT | Sharing student |
| `file_size_bytes`| `BIGINT` | Yes | None | None | File size in bytes (if applicable) |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Upload timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | None | Update timestamp |
