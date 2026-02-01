# Implementation Plan: Full-Stack Web Todo Application

**Branch**: `002-todo-web-app` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-todo-web-app/spec.md`

## Summary

Build a full-stack web todo application for Phase II with the following characteristics:
- **Frontend**: Next.js 16+ (App Router, TypeScript, Tailwind CSS)
- **Backend**: FastAPI (Python REST API)
- **Database**: Neon Serverless PostgreSQL with SQLModel ORM + Alembic migrations
- **Authentication**: Better Auth (JWT-based, frontend-first)
- **Architecture**: Monorepo with frontend/ and backend/ directories
- **Communication**: REST JSON APIs with JWT Bearer token authentication

## Technical Context

**Language/Version**: Python 3.13+ (backend), TypeScript (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Alembic, Next.js 16+, Better Auth, Tailwind CSS
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Jest/Playwright (frontend)
**Target Platform**: Web browser (responsive, mobile-first)
**Project Type**: Full-stack web application (monorepo: frontend + backend)
**Performance Goals**: 95% API requests < 1 second, user actions complete within 2 seconds
**Constraints**: No AI, no agents, no real-time features, no background jobs, phase isolation enforced
**Scale/Scope**: Single-user data isolation, 5 todo CRUD operations, authentication flow

## Constitution Check

*GATE: Must pass before proceeding. Re-check after Phase 1 design.*

| Gate | Requirement | Status | Notes |
|------|-------------|--------|-------|
| Phase II Tech Stack | Next.js 16+, FastAPI, SQLModel, Neon DB, Better Auth | ✅ PASS | Matches constitution Phase II matrix |
| Phase Isolation | No Phase I console logic, no Phase III+ concepts | ✅ PASS | No AI/agents/MCP/Kubernetes/Kafka/Dapr |
| Authentication | JWT-based, row-level security | ✅ PASS | User_id FK enforced on all queries |
| Monorepo Structure | frontend/ + backend/ separation | ✅ PASS | Clear component responsibilities |
| No Real-time | No WebSockets, polling acceptable | ✅ PASS | Confirmed in spec |
| No Analytics/Background | No jobs, no advanced analytics | ✅ PASS | Out of scope |

**Result**: All gates pass. Proceed to Phase 1 design.

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-web-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (this file)
├── spec.md              # Feature specification
├── data-model.md        # Phase 1 output (database schema)
├── quickstart.md        # Phase 1 output (development guide)
├── contracts/           # Phase 1 output (API specifications)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
# Monorepo structure for full-stack web application
frontend/                # Next.js 16+ application
├── src/
│   ├── app/            # App Router pages
│   │   ├── (auth)/     # Auth route group
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── todos/      # Protected todos page
│   │   └── page.tsx    # Landing page
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   │   ├── api.ts      # API client wrapper
│   │   └── auth.ts     # Better Auth config
│   └── styles/         # Global styles
├── public/             # Static assets
├── package.json
├── tailwind.config.ts
└── next.config.ts

backend/                 # FastAPI application
├── src/
│   ├── models/
│   │   └── task.py     # SQLModel Task
│   ├── api/
│   │   └── routes/
│   │       └── todos.py # Todo endpoints
│   ├── core/
│   │   ├── config.py   # Settings
│   │   └── db.py       # Database connection
│   ├── dependencies/
│   │   └── auth.py     # JWT verification
│   └── main.py         # FastAPI app
├── alembic/
│   ├── versions/       # Migrations
│   └── env.py
├── pyproject.toml
└── requirements.txt

tests/
├── backend/            # pytest tests
└── frontend/           # Jest/Playwright tests
```

**Structure Decision**: Full-stack monorepo with separate frontend (Next.js) and backend (FastAPI) directories. This matches the constitution's Phase II technology matrix and ensures clear separation of concerns.

## Component Responsibilities

| Component | Responsibility | Location |
|-----------|----------------|----------|
| Next.js Frontend | Render UI, handle user input, manage auth session, call REST APIs, show loading/error states | frontend/ |
| Better Auth | Handle signup, signin, session management, JWT issuance on frontend | frontend/ |
| API Client | Centralized fetch/axios wrapper with JWT header, error handling | frontend/lib/api.ts |
| FastAPI Backend | Expose REST endpoints, validate JWT, enforce user ownership, CRUD on DB | backend/ |
| SQLModel + Neon DB | Persist todos with user_id FK, provide type-safe queries | backend/models.py |
| JWT Middleware | Verify token, attach current_user to request state | backend/dependencies/auth.py |
| Tailwind CSS | Provide responsive styling (mobile-first) | frontend/ |

## API Communication Strategy

- All calls from frontend → backend use HTTPS (localhost:8000 in dev, production URL later)
- Every request includes `Authorization: Bearer <jwt-token>` header
- API client wrapper:
  - `api.get('/todos')`, `api.post('/todos', data)`, etc.
  - Automatically adds JWT from auth session
  - Handles common errors: 401 → redirect to login, 403/404 → show message
- JSON request/response format only
- Use `fetch` or `axios` with interceptors for token injection & response parsing
- No caching in Phase II (simple fetch on mount + manual refresh)

## Authentication State Handling

- Frontend: Better Auth provides `useSession()` hook or context
- Session state stored in cookies/localStorage (handled by Better Auth)
- Protected routes (/todos):
  - Middleware or layout checks `session.status === "authenticated"`
  - If unauthenticated → redirect to /login
- Logout: call Better Auth signOut() → clear session → redirect to /
- Token refresh: handled automatically by Better Auth (if configured)
- On 401 from API → signOut() + redirect to login

## Responsive UI Strategy

- Tailwind CSS (mobile-first approach)
- Use utility classes: `sm:`, `md:`, `lg:` breakpoints
- Layouts:
  - Mobile: stacked list + floating add button
  - Desktop: sidebar or grid for better visibility
- Forms: full-width on mobile, constrained width on desktop
- Todo list: card-style items with swipe actions (optional) or buttons
- Loading: skeletons or spinners during API calls
- Error: red toast/banner for failures
- Accessibility: semantic HTML, aria-labels on buttons

## Database Plan

### User data model
- Managed by Better Auth
- Reference fields: id (string PK), email, name
- No custom User model in SQLModel (use reference via user_id FK)

### Todo data model
- SQLModel class: Task
- Fields:
  - id: int (PK, autoincrement)
  - user_id: str (FK → users.id)
  - title: str (max_length=200)
  - description: Optional[str] (max_length=1000)
  - completed: bool (default=False)
  - created_at: datetime (server_default=func.now())
  - updated_at: datetime (server_default=func.now(), onupdate=func.now())

### Relationship between user and todo
- One-to-many: one user → many todos
- Enforced via foreign key constraint on todos.user_id
- Every query filters `Task.user_id == current_user.id`

### Migration approach
- Use Alembic (integrated with SQLModel)
- Initial migration: create todos table with user_id FK
- Future changes: generate/apply migrations via alembic revision & upgrade
- Dev: `alembic upgrade head` on startup or manually
- Production: run migrations during deployment

## Sequential Implementation Guidance

1. Backend: structure, models, DB connection, JWT dep
2. Backend: todos routes (6 endpoints)
3. Frontend: Next.js init, Better Auth setup
4. Frontend: auth pages (/login, /signup)
5. Frontend: protected /todos page + API client
6. Frontend: CRUD UI + toggle/delete actions
7. Testing: manual end-to-end flow

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No constitution violations identified | - |

**Note**: No complexity tracking required. All decisions align with constitution.
