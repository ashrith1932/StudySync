# StudySync System Architecture Specification

## 1. Architectural Style & Principles
StudySync follows a modern **Three-Tier Layered Architecture** with unidirectional data flow and strict separation of concerns.

```
+-------------------------------------------------------------------------+
|                        Presentation Tier (Client)                       |
|   React 18 + Vite SPA | Tailwind CSS | React Router | Axios Client      |
+-------------------------------------------------------------------------+
                                     |  HTTPS / REST / JSON
                                     v
+-------------------------------------------------------------------------+
|                        Application Tier (Server)                        |
|   Express 4.x (ESM) | Zod Validation | JWT Middleware | Central Error   |
|   Controllers  -->  Domain Services  -->  Repositories (Data Access)    |
+-------------------------------------------------------------------------+
                                     |  pg Connection Pool
                                     v
+-------------------------------------------------------------------------+
|                          Data Tier (Persistence)                        |
|   PostgreSQL 14+ Relational Engine | 3NF Schema | B-Tree & GIN Indexes  |
+-------------------------------------------------------------------------+
```

---

## 2. Layer Responsibilities & Isolation Rules

### 2.1 Presentation Tier (`frontend/src/`)
- **`pages/`**: Route-level views (e.g. `LoginPage`, `DashboardPage`, `GroupDetailPage`, `CalendarPage`). Responsible for page composition and lifecycle triggers.
- **`components/`**: Reusable atomic and composite UI widgets (e.g. `Navbar`, `GroupCard`, `SessionModal`, `AvailabilityPicker`, `Badge`). Completely isolated from backend details.
- **`services/`**: Centralized API clients wrapping Axios. Contains endpoint URL builders and returns strongly typed `ApiResponse<T>` promises.
- **`context/`**: React Context providers managing global client state (`AuthContext`, `ToastContext`).
- **`types/`**: Authoritative TypeScript interfaces matching domain models.

### 2.2 Application Tier (`backend/src/`)
- **`middleware/`**:
  - `authMiddleware.js`: Verifies incoming Bearer JWT tokens, decodes payload, and attaches `req.user`.
  - `roleMiddleware.js`: Validates role-based permissions (`student`, `admin`).
  - `errorMiddleware.js`: Catches all thrown domain/system errors and produces standard error envelopes.
- **`controllers/`**:
  - Responsible strictly for HTTP protocol translation: reads `req.body`, `req.params`, `req.query`, invokes Zod schema validation, delegates execution to domain services, and formats the response envelope.
  - **No SQL queries or raw database interactions allowed in controllers.**
- **`services/`**:
  - Contains core domain logic: matching algorithms, capacity limit checks, scheduling overlap detection, and bcrypt hashing orchestration.
  - Independent of Express HTTP objects (`req`, `res`).
- **`repositories/`**:
  - Data Access Object (DAO) pattern. The only layer executing SQL queries against the PostgreSQL connection pool. Encapsulates transaction logic (`BEGIN`, `COMMIT`, `ROLLBACK`).

### 2.3 Data Tier (`database/`)
- PostgreSQL 14+ database instance enforcing primary keys, foreign keys with appropriate cascade/restrict semantics, check constraints, unique constraints, and B-Tree/GIN indexes.

---

## 3. Cross-Cutting Concerns

### 3.1 Security & Authentication Architecture
- **Stateless Tokens:** Authentication relies on signed JSON Web Tokens (HMAC-SHA256). No server-side session memory is required.
- **Password Salting:** High-entropy salt generation via `bcrypt` with 10 work rounds.
- **CORS Protection:** Express CORS middleware restricted strictly to configured `CLIENT_ORIGIN` (e.g., `http://localhost:5173`).
- **Parameter Tampering Defense:** SQL queries strictly use parameterized queries (`$1, $2, ...`) via the node-postgres pool.

### 3.2 Error Handling & Logging Strategy
- Centralized error handler captures:
  - `ZodError` $\rightarrow$ Formats into `400 Bad Request` with field-level error messages.
  - `UnauthorizedError` $\rightarrow$ `401 Unauthorized`.
  - `ForbiddenError` $\rightarrow$ `403 Forbidden`.
  - `NotFoundError` $\rightarrow$ `404 Not Found`.
  - `ConflictError` $\rightarrow$ `409 Conflict`.
  - Unhandled exceptions $\rightarrow$ Logged with stack trace internally, returns sanitized `500 Internal Server Error` to the client.
