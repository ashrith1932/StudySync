# StudySync Detailed Use-Case Descriptions

## 1. Use-Case: UC-01 (Register and Setup Profile)
- **Primary Actor:** Student User
- **Preconditions:** Student has a valid university email address.
- **Trigger:** Student clicks "Create Account" on landing page.
- **Main Success Scenario:**
  1. Student enters full name, university email, and password.
  2. System validates input formats and confirms email is not already registered.
  3. System hashes password via bcrypt and creates record in `users` table.
  4. System prompts user for major, learning goals, and weekly recurring availability slots.
  5. Student submits academic preferences and availability.
  6. System creates `user_profiles` record and generates JWT token.
  7. Student is redirected to the personalized Dashboard.
- **Extensions / Exceptions:**
  - *2a. Email format invalid:* System displays inline validation warning.
  - *2b. Email already in use:* System returns `409 Conflict` with clear prompt to log in.

---

## 2. Use-Case: UC-04 (Create Study Group)
- **Primary Actor:** Student User (Becomes Group Owner)
- **Preconditions:** Student is logged in with an active account.
- **Trigger:** Student clicks "Create New Group" on Groups directory.
- **Main Success Scenario:**
  1. Student fills in group name, description, selects course subject from catalog, specifies max members (2–50), and visibility (`public`/`private`).
  2. System validates parameters and creates new record in `study_groups`.
  3. System automatically inserts a record into `group_memberships` with `role = 'owner'` and `status = 'accepted'`.
  4. System confirms group creation and navigates to the new Group Detail view.
- **Extensions / Exceptions:**
  - *1a. Maximum member count outside 2–50 range:* Form prevents submission with boundary error.

---

## 3. Use-Case: UC-07 & UC-08 (Join Request & Owner Approval Workflow)
- **Primary Actors:** Applicant (Student), Group Owner
- **Preconditions:** Group has open capacity ($n < \text{maxMembers}$).
- **Main Success Scenario:**
  1. Applicant browses to group detail and clicks "Request to Join".
  2. Applicant provides an optional note describing their study goals.
  3. System creates a `group_memberships` record with `status = 'pending'`.
  4. Group Owner receives notification or views pending request in their owner dashboard.
  5. Group Owner reviews applicant's profile and clicks "Approve".
  6. System updates `group_memberships.status` to `'accepted'`, sets `joined_at = NOW()`, and increments group member count.
- **Extensions / Exceptions:**
  - *1a. Group reaches capacity before approval:* System blocks approval with `GROUP_CAPACITY_REACHED` alert.

---

## 4. Use-Case: UC-09 & UC-10 (Schedule Session with Overlap Guard)
- **Primary Actor:** Group Owner / Admin
- **Preconditions:** Study group is active.
- **Main Success Scenario:**
  1. Group Owner enters session title, date, start time, end time, and meeting link.
  2. System validates that `endTime > startTime` and `startTime > NOW()`.
  3. System queries existing study sessions across all enrolled group members for conflicting intervals.
  4. If conflicts exist, system returns a warning alert detailing overlapping members.
  5. Owner confirms schedule; system inserts record into `study_sessions`.
  6. System automatically creates `session_attendees` entries initialized to `status = 'tentative'` for all enrolled group members.
