# StudySync Authoritative REST API Specification

**Base URL:** `http://localhost:5000/api/v1`  
**Protocol:** HTTP/1.1 or HTTP/2 over TLS (Production)  
**Content-Type:** `application/json`  
**Authentication Header:** `Authorization: Bearer <jwt_token>`  

---

## 1. Global Standard Response Envelopes

### Success (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Optional human-readable summary",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "error": null
}
```

### Error (`400`, `401`, `403`, `404`, `409`, `422`, `500`)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Descriptive error message",
    "details": [
      {
        "field": "fieldName",
        "message": "Specific field validation message"
      }
    ]
  }
}
```

---

## 2. API Endpoint Directory

### 2.1 Authentication (`/api/v1/auth`)

#### `POST /api/v1/auth/register`
- **Access:** Public
- **Description:** Registers a new student user.
- **Request Body:**
  ```json
  {
    "email": "student@university.edu",
    "password": "Password123!",
    "fullName": "Student Name"
  }
  ```
- **Responses:**
  - `201 Created`: User created with token.
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Email already registered.

#### `POST /api/v1/auth/login`
- **Access:** Public
- **Description:** Authenticates credentials and returns JWT token.
- **Request Body:**
  ```json
  {
    "email": "student@university.edu",
    "password": "Password123!"
  }
  ```
- **Responses:**
  - `200 OK`: Returns token and basic user info.
  - `401 Unauthorized`: Invalid credentials.

#### `GET /api/v1/auth/me`
- **Access:** Authenticated
- **Description:** Returns the authenticated user's session profile.
- **Responses:**
  - `200 OK`: Returns current user object.
  - `401 Unauthorized`: Invalid or expired token.

---

### 2.2 Users & Profiles (`/api/v1/users`)

#### `GET /api/v1/users/profile`
- **Access:** Authenticated
- **Description:** Retrieves the student's profile, availability, and subjects.

#### `PUT /api/v1/users/profile`
- **Access:** Authenticated
- **Description:** Updates academic bio, major, year, and goals.
- **Request Body:**
  ```json
  {
    "bio": "CS junior passionate about backend systems",
    "major": "Computer Science",
    "academicYear": "3rd Year",
    "learningGoals": ["Master SQL", "Prepare for SE301 Exam"]
  }
  ```

#### `PUT /api/v1/users/availability`
- **Access:** Authenticated
- **Description:** Updates weekly recurring time slots.
- **Request Body:**
  ```json
  {
    "availability": [
      { "dayOfWeek": "monday", "startTime": "14:00", "endTime": "17:00" },
      { "dayOfWeek": "wednesday", "startTime": "10:00", "endTime": "12:00" }
    ]
  }
  ```

---

### 2.3 Subjects Catalog (`/api/v1/subjects`)

#### `GET /api/v1/subjects`
- **Access:** Public
- **Description:** Retrieves list of available university course subjects.

---

### 2.4 Study Groups (`/api/v1/groups`)

#### `POST /api/v1/groups`
- **Access:** Authenticated
- **Description:** Creates a new study group. The creator is automatically added as `owner`.
- **Request Body:**
  ```json
  {
    "name": "Software Engineering Architecture Group",
    "description": "Collaborative preparation for SE301 design patterns and UML.",
    "subjectId": "11111111-1111-1111-1111-111111111101",
    "maxMembers": 6,
    "visibility": "public",
    "tags": ["SoftwareEng", "Architecture"]
  }
  ```

#### `GET /api/v1/groups`
- **Access:** Public / Authenticated
- **Query Parameters:** `search`, `subjectId`, `page`, `limit`
- **Description:** Searches and paginates study groups.

#### `GET /api/v1/groups/:id`
- **Access:** Authenticated
- **Description:** Returns group metadata, member count, and owner info.

#### `GET /api/v1/groups/recommendations`
- **Access:** Authenticated
- **Description:** Returns study groups ranked by compatibility score with the logged-in student.
- **Response Data Item:**
  ```json
  {
    "groupId": "44444444-4444-4444-4444-444444444401",
    "groupName": "SE301 Architecture Study Circle",
    "compatibilityScore": 88,
    "breakdown": {
      "subjectMatch": 40,
      "scheduleMatch": 32,
      "goalMatch": 16
    }
  }
  ```

---

### 2.5 Group Membership (`/api/v1/groups/:id/members`)

#### `POST /api/v1/groups/:id/join`
- **Access:** Authenticated
- **Description:** Submits a join request for a study group.
- **Request Body:**
  ```json
  { "requestNote": "Hi, I would love to join your weekly design pattern review." }
  ```

#### `GET /api/v1/groups/:id/members`
- **Access:** Authenticated (Group Member or Owner)
- **Description:** Lists members and pending requests for the group.

#### `PATCH /api/v1/groups/:id/members/:userId`
- **Access:** Authenticated (Group Owner / Admin only)
- **Description:** Approves or rejects a pending membership request.
- **Request Body:**
  ```json
  { "status": "accepted" }
  ```

---

### 2.6 Study Sessions & Calendar (`/api/v1/sessions`)

#### `POST /api/v1/groups/:groupId/sessions`
- **Access:** Authenticated (Group Owner / Admin)
- **Description:** Schedules a new study session with boundary and conflict checks.
- **Request Body:**
  ```json
  {
    "title": "Design Patterns & UML Sprint Review",
    "description": "Covering Creational & Structural patterns",
    "startTime": "2026-10-20T14:00:00.000Z",
    "endTime": "2026-10-20T16:00:00.000Z",
    "locationType": "online",
    "meetingLinkOrVenue": "https://meet.university.edu/se301-review"
  }
  ```

#### `GET /api/v1/sessions/calendar`
- **Access:** Authenticated
- **Query Parameters:** `from` (ISO Date), `to` (ISO Date)
- **Description:** Retrieves all study sessions across the user's enrolled groups within the time range.

#### `PATCH /api/v1/sessions/:id/rsvp`
- **Access:** Authenticated (Enrolled Member)
- **Description:** Updates student attendance RSVP (`attending`, `declined`, `tentative`).

#### `POST /api/v1/sessions/:id/checkin`
- **Access:** Authenticated
- **Description:** Records verified attendance check-in timestamp during the active session.

---

### 2.7 Shared Resources (`/api/v1/groups/:groupId/resources`)

#### `POST /api/v1/groups/:groupId/resources`
- **Access:** Authenticated (Group Member)
- **Description:** Uploads or links a study resource.
- **Request Body:**
  ```json
  {
    "title": "Architectural Design Patterns Cheat Sheet",
    "description": "Comprehensive reference PDF",
    "resourceType": "document",
    "resourceUri": "https://storage.university.edu/study/cheat_sheet.pdf",
    "fileSizeBytes": 1048576
  }
  ```

#### `GET /api/v1/groups/:groupId/resources`
- **Access:** Authenticated (Group Member)
- **Description:** Lists all shared resources belonging to the group.
