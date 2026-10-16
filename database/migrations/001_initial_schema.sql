-- =============================================================================
-- StudySync Initial Database Schema Migration (001_initial_schema.sql)
-- Target RDBMS: PostgreSQL 14+
-- Normalized to Third Normal Form (3NF) with referential integrity constraints.
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- Core authentication and user account identity
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 2. Table: subjects
-- Standardized academic course/subject catalog
-- -----------------------------------------------------------------------------
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'SE301', 'CS102'
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_code ON subjects(code);

-- -----------------------------------------------------------------------------
-- 3. Table: user_profiles
-- Student academic preferences, learning goals, and schedule availability
-- -----------------------------------------------------------------------------
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    major VARCHAR(150),
    academic_year VARCHAR(50),
    learning_goals TEXT[] DEFAULT '{}',
    preferred_subjects TEXT[] DEFAULT '{}',
    availability JSONB NOT NULL DEFAULT '[]', -- Array of { dayOfWeek, startTime, endTime }
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_availability ON user_profiles USING GIN (availability);

-- -----------------------------------------------------------------------------
-- 4. Table: study_groups
-- Collaborative study groups formed around subjects
-- -----------------------------------------------------------------------------
CREATE TABLE study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    max_members INT NOT NULL DEFAULT 8 CHECK (max_members >= 2 AND max_members <= 50),
    visibility VARCHAR(20) NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_study_groups_subject_id ON study_groups(subject_id);
CREATE INDEX idx_study_groups_creator_id ON study_groups(creator_id);
CREATE INDEX idx_study_groups_visibility ON study_groups(visibility);

-- -----------------------------------------------------------------------------
-- 5. Table: group_memberships
-- Group enrollment, role permissions, and access approval workflows
-- -----------------------------------------------------------------------------
CREATE TABLE group_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'left')),
    request_note TEXT,
    joined_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_group_user UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_group_memberships_user_id ON group_memberships(user_id);
CREATE INDEX idx_group_memberships_status ON group_memberships(status);

-- -----------------------------------------------------------------------------
-- 6. Table: study_sessions
-- Scheduled study meetings with location and time boundary validation
-- -----------------------------------------------------------------------------
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location_type VARCHAR(30) NOT NULL DEFAULT 'online' CHECK (location_type IN ('online', 'in_person')),
    meeting_link_or_venue TEXT NOT NULL,
    created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_session_time_interval CHECK (end_time > start_time)
);

CREATE INDEX idx_study_sessions_group_id ON study_sessions(group_id);
CREATE INDEX idx_study_sessions_time_range ON study_sessions(start_time, end_time);

-- -----------------------------------------------------------------------------
-- 7. Table: session_attendees
-- Student RSVP, participation status, and verified attendance check-in
-- -----------------------------------------------------------------------------
CREATE TABLE session_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'tentative' CHECK (status IN ('attending', 'declined', 'tentative', 'attended', 'absent')),
    check_in_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_session_user UNIQUE(session_id, user_id)
);

CREATE INDEX idx_session_attendees_session_id ON session_attendees(session_id);
CREATE INDEX idx_session_attendees_user_id ON session_attendees(user_id);

-- -----------------------------------------------------------------------------
-- 8. Table: study_resources
-- Shared notes, links, and documents associated with study groups
-- -----------------------------------------------------------------------------
CREATE TABLE study_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(30) NOT NULL CHECK (resource_type IN ('document', 'link', 'note', 'code_snippet')),
    resource_uri TEXT NOT NULL,
    uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    file_size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_study_resources_group_id ON study_resources(group_id);
CREATE INDEX idx_study_resources_uploader_id ON study_resources(uploader_id);
