---

description: "Task list for Phase II Full-Stack Web Todo Application"
---

# Tasks: Full-Stack Web Todo Application

**Input**: Design documents from `specs/002-todo-web-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/
**Phase**: Phase II

**Tests**: NOT requested in specification - omit test tasks

**Organization**: Tasks are grouped by phase to enable sequential implementation

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/`, `backend/src/`, `backend/alembic/`
- **Frontend**: `frontend/`, `frontend/src/`
- **Tests**: `tests/backend/`, `tests/frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization for both backend and frontend

- [X] T001 Create backend directory structure per implementation plan
- [X] T002 [P] Create backend/main.py with FastAPI instance and /health endpoint
- [X] T003 [P] Create backend/requirements.txt with fastapi, uvicorn, sqlmodel, psycopg2-binary, python-jose[cryptography], python-multipart, alembic
- [X] T004 Initialize Next.js project in frontend/ with TypeScript and Tailwind CSS
- [X] T005 [P] Create frontend/app/layout.tsx with basic layout and Tailwind setup
- [X] T006 [P] Create frontend/app/globals.css with Tailwind directives

**Checkpoint**: Backend and frontend projects initialized and running

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**CRITICAL**: No user story work can begin until this phase is complete

### Database & Models

- [X] T007 Create backend/database.py with SQLModel engine and get_db() dependency
- [X] T008 [P] Update backend/main.py to include database configuration
- [X] T009 Create backend/models.py with Task SQLModel class (id, user_id, title, description, completed, timestamps)
- [X] T010 [P] Add foreign key constraint and index on user_id in Task model

### Authentication

- [X] T011 Create backend/dependencies/auth.py with get_current_user JWT verification dependency
- [X] T012 [P] Update backend/main.py to include auth dependency on protected routes

### Migrations

- [X] T013 Initialize Alembic for migrations
- [X] T014 [P] Create initial migration to create todos table with user_id FK

**Checkpoint**: Foundation ready - database connected, models defined, auth middleware in place

---

## Phase 3: User Story 1 - User Authentication (Priority: P1)

**Goal**: Users can sign up and sign in to access their todos

**Independent Test**: User can create account on /signup and authenticate on /login; JWT token is issued

### Backend Auth Enforcement

- [X] T015 Implement user_id filter in all todo queries for ownership enforcement
- [X] T016 [P] Add consistent HTTP exception handlers for 401, 403, 404, 400 responses

### Frontend Auth Integration

- [X] T017 Set up Better Auth configuration in frontend/lib/auth.ts
- [X] T018 [P] Create frontend/app/signup/page.tsx with signup form
- [X] T019 [P] Create frontend/app/login/page.tsx with login form
- [X] T020 Implement session management with useSession() hook or context
- [X] T021 Create frontend/middleware.ts or update layout.tsx for protected route check

**Checkpoint**: User Story 1 complete - users can signup, login, and access protected routes

---

## Phase 4: User Story 2 - Create & View Todos (Priority: P1)

**Goal**: Authenticated users can create new todos and view their todo list

**Independent Test**: User can add a todo via /todos page and see it appear in the list

### API Endpoints

- [X] T022 Implement POST /api/todos endpoint (create todo)
- [X] T023 [P] Implement GET /api/todos endpoint (list all user's todos)
- [X] T024 [P] Implement GET /api/todos/{id} endpoint (get single todo)

### Frontend API Client

- [X] T025 Create frontend/lib/api.ts with centralized fetch wrapper and JWT header injection
- [X] T026 [P] Handle 401 redirect to login in API client

### Frontend Todos Page

- [X] T027 Create frontend/app/todos/page.tsx with todo list view and add form
- [X] T028 [P] Connect API client to fetch and display todos
- [X] T029 [P] Implement add todo form and submission

**Checkpoint**: User Story 2 complete - users can create and view todos

---

## Phase 5: User Story 3 - Update & Delete Todos (Priority: P2)

**Goal**: Authenticated users can edit and delete their own todos

**Independent Test**: User can edit a todo's title/description and delete a todo

### API Endpoints

- [X] T030 Implement PUT /api/todos/{id} endpoint (update todo)
- [X] T031 [P] Implement DELETE /api/todos/{id} endpoint (delete todo)

### Frontend Update UI

- [X] T032 Create frontend/components/TodoItem.tsx with edit form, delete button
- [X] T033 [P] Update frontend/app/todos/page.tsx to include edit/delete actions

**Checkpoint**: User Story 3 complete - users can update and delete todos

---

## Phase 6: User Story 4 - Toggle Completion (Priority: P2)

**Goal**: Authenticated users can mark todos as complete or incomplete

**Independent Test**: User can toggle a todo's completion status and see the visual change

### API Endpoint

- [X] T034 Implement PATCH /api/todos/{id}/complete endpoint (toggle completion)

### Frontend Toggle UI

- [X] T035 Add toggle button to TodoItem component
- [X] T036 [P] Connect toggle to API client and update UI state

**Checkpoint**: User Story 4 complete - users can toggle todo completion

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [X] T037 Apply responsive Tailwind CSS styles for mobile and desktop layouts
- [X] T038 [P] Add loading states (skeletons or spinners) during API calls
- [X] T039 [P] Add error toasts/messages for failed operations
- [X] T040 Add aria-labels and semantic HTML for accessibility
- [X] T041 Run quickstart.md validation to verify complete flow

**Checkpoint**: All features complete and polished

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | None | Phase 2 |
| Phase 2: Foundational | Phase 1 | All User Stories |
| Phase 3: Auth | Phase 2 | Phases 4-6 |
| Phase 4: Create/View | Phase 2 | Phase 7 |
| Phase 5: Update/Delete | Phase 2 | Phase 7 |
| Phase 6: Toggle | Phase 2 | Phase 7 |
| Phase 7: Polish | Phases 3-6 | - |

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Authentication (Story 1)
4. Complete Phase 4: Create & View Todos (Story 2)
5. **STOP and VALIDATE**: Test auth + CRUD flow
6. Deploy/demo if ready

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 41 |
| Status | 100% Complete |

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- All tasks verified and implemented per specification.
