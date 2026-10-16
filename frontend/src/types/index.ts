/**
 * StudySync - Frontend Shared Type Definitions and Data Contracts
 * Authoritative contracts matching the Backend API and PostgreSQL relational model.
 */

// -----------------------------------------------------------------------------
// Core System & User Types
// -----------------------------------------------------------------------------

export type UserRole = 'student' | 'admin';

export interface User {
  id: string; // UUID v4
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  major?: string;
  academicYear?: string;
  learningGoals?: string[];
  preferredSubjects: string[]; // Subject IDs or names
  availability: WeeklyAvailability;
  createdAt: string;
  updatedAt: string;
}

export interface DayTimeSlot {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // HH:mm format (24h)
  endTime: string;   // HH:mm format (24h)
}

export type WeeklyAvailability = DayTimeSlot[];

// -----------------------------------------------------------------------------
// Subject & Academic Taxonomy
// -----------------------------------------------------------------------------

export interface Subject {
  id: string;
  code: string; // e.g., 'CS301'
  name: string; // e.g., 'Software Engineering'
  department?: string;
}

// -----------------------------------------------------------------------------
// Study Group & Membership Types
// -----------------------------------------------------------------------------

export type GroupVisibility = 'public' | 'private';
export type MembershipRole = 'owner' | 'admin' | 'member';
export type MembershipStatus = 'pending' | 'accepted' | 'rejected' | 'left';

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  subjectName?: string;
  creatorId: string;
  maxMembers: number;
  currentMemberCount: number;
  visibility: GroupVisibility;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupMembership {
  id: string;
  groupId: string;
  userId: string;
  userFullName?: string;
  userEmail?: string;
  role: MembershipRole;
  status: MembershipStatus;
  requestNote?: string;
  joinedAt?: string;
  createdAt: string;
}

export interface MatchScoreResult {
  groupId?: string;
  targetUserId?: string;
  matchScore: number; // 0 to 100 percentage
  breakdown: {
    subjectOverlap: number;
    scheduleCompatibility: number;
    goalAlignment: number;
  };
  details: string;
}

// -----------------------------------------------------------------------------
// Scheduling & Session Types
// -----------------------------------------------------------------------------

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type AttendanceStatus = 'attending' | 'declined' | 'tentative' | 'attended' | 'absent';

export interface StudySession {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  startTime: string; // ISO 8601 UTC
  endTime: string;   // ISO 8601 UTC
  locationType: 'online' | 'in_person';
  meetingLinkOrVenue: string;
  createdById: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SessionAttendee {
  sessionId: string;
  userId: string;
  userFullName?: string;
  status: AttendanceStatus;
  checkInTime?: string;
}

// -----------------------------------------------------------------------------
// Resource Sharing Types
// -----------------------------------------------------------------------------

export type ResourceType = 'document' | 'link' | 'note' | 'code_snippet';

export interface StudyResource {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  resourceType: ResourceType;
  resourceUri: string; // URL or cloud path
  uploaderId: string;
  uploaderName?: string;
  fileSizeBytes?: number;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Standardized API Envelope Responses
// -----------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: null;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error: {
    code: string; // e.g. "VALIDATION_ERROR", "UNAUTHORIZED", "NOT_FOUND"
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
