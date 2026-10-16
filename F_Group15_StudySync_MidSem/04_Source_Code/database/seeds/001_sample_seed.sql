-- =============================================================================
-- StudySync Sample Test Seed Data (001_sample_seed.sql)
-- Used for automated integration tests, UI evaluation, and demo verification.
-- NOTE: Passwords hashed using bcrypt (cost 10) for 'Password123!'
-- =============================================================================

-- 1. Insert Standard Subjects
INSERT INTO subjects (id, code, name, department) VALUES
('11111111-1111-1111-1111-111111111101', 'CS301', 'Software Engineering', 'Computer Science'),
('11111111-1111-1111-1111-111111111102', 'CS204', 'Database Management Systems', 'Computer Science'),
('11111111-1111-1111-1111-111111111103', 'MATH201', 'Linear Algebra & Discrete Math', 'Mathematics'),
('11111111-1111-1111-1111-111111111104', 'CS308', 'Operating Systems & Distributed Systems', 'Computer Science');

-- 2. Insert Demo Users (Sample password hash for 'Password123!')
INSERT INTO users (id, email, password_hash, full_name, role) VALUES
('22222222-2222-2222-2222-222222222201', 'alice.chen@university.edu', '$2a$10$wT3wF2V7k240YkHjA5hTleYgG4hQfQoXkK79WwXbM0eH6sO1u.0Gy', 'Alice Chen', 'student'),
('22222222-2222-2222-2222-222222222202', 'bob.kumar@university.edu', '$2a$10$wT3wF2V7k240YkHjA5hTleYgG4hQfQoXkK79WwXbM0eH6sO1u.0Gy', 'Bob Kumar', 'student'),
('22222222-2222-2222-2222-222222222203', 'clara.santos@university.edu', '$2a$10$wT3wF2V7k240YkHjA5hTleYgG4hQfQoXkK79WwXbM0eH6sO1u.0Gy', 'Clara Santos', 'student'),
('22222222-2222-2222-2222-222222222204', 'david.kim@university.edu', '$2a$10$wT3wF2V7k240YkHjA5hTleYgG4hQfQoXkK79WwXbM0eH6sO1u.0Gy', 'David Kim', 'student');

-- 3. Insert User Profiles
INSERT INTO user_profiles (id, user_id, bio, major, academic_year, learning_goals, preferred_subjects, availability) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'Junior CS student focused on full-stack architecture.', 'Computer Science', '3rd Year',
 ARRAY['Master System Design', 'Prepare for Mid-Sem'], ARRAY['CS301', 'CS204'],
 '[{"dayOfWeek": "monday", "startTime": "14:00", "endTime": "17:00"}, {"dayOfWeek": "wednesday", "startTime": "14:00", "endTime": "18:00"}]'::jsonb),

('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', 'Passionate about databases and backend optimization.', 'Computer Science', '3rd Year',
 ARRAY['Score A in DBMS', 'Build Relational Schema'], ARRAY['CS204', 'CS308'],
 '[{"dayOfWeek": "monday", "startTime": "15:00", "endTime": "18:00"}, {"dayOfWeek": "friday", "startTime": "10:00", "endTime": "13:00"}]'::jsonb),

('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222203', 'Interested in math and algorithm analysis.', 'Software Engineering', '2nd Year',
 ARRAY['Discrete Math Mastery'], ARRAY['MATH201', 'CS301'],
 '[{"dayOfWeek": "tuesday", "startTime": "10:00", "endTime": "13:00"}, {"dayOfWeek": "thursday", "startTime": "10:00", "endTime": "13:00"}]'::jsonb);

-- 4. Insert Study Groups
INSERT INTO study_groups (id, name, description, subject_id, creator_id, max_members, visibility, tags) VALUES
('44444444-4444-4444-4444-444444444401', 'SE301 Architecture Study Circle', 'Weekly collaborative review of architectural styles, design patterns, and UML modeling.', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 6, 'public', ARRAY['SoftwareEng', 'Architecture', 'UML']),
('44444444-4444-4444-4444-444444444402', 'CS204 PostgreSQL Query Deep Dive', 'Focused group solving complex SQL queries, transaction isolation, and index optimizations.', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 5, 'public', ARRAY['Databases', 'SQL', 'PostgreSQL']);

-- 5. Insert Group Memberships
INSERT INTO group_memberships (id, group_id, user_id, role, status, joined_at) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', 'owner', 'accepted', CURRENT_TIMESTAMP),
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222202', 'member', 'accepted', CURRENT_TIMESTAMP),
('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222202', 'owner', 'accepted', CURRENT_TIMESTAMP);

-- 6. Insert Study Session
INSERT INTO study_sessions (id, group_id, title, description, start_time, end_time, location_type, meeting_link_or_venue, created_by_id, status) VALUES
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', 'Mid-Sem Design Patterns Review', 'Review Creational and Structural patterns ahead of mid-term evaluation.',
 CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days 2 hours', 'online', 'https://meet.university.edu/studysync-se301', '22222222-2222-2222-2222-222222222201', 'scheduled');

-- 7. Insert Session Attendees
INSERT INTO session_attendees (id, session_id, user_id, status) VALUES
('77777777-7777-7777-7777-777777777701', '66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222201', 'attending'),
('77777777-7777-7777-7777-777777777702', '66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222202', 'attending');

-- 8. Insert Study Resource
INSERT INTO study_resources (id, group_id, title, description, resource_type, resource_uri, uploader_id, file_size_bytes) VALUES
('88888888-8888-8888-8888-888888888801', '44444444-4444-4444-4444-444444444401', 'Software Architecture Styles Cheat Sheet', 'Quick reference PDF covering Layered, Clean, and Microservices patterns.', 'document', 'https://storage.university.edu/resources/se301_cheat_sheet.pdf', '22222222-2222-2222-2222-222222222201', 1048576);
