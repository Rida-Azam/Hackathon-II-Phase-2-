# Tasks: Evolution of Todo - Responsive Black Theme

**Input**: Design documents from `/specs/006-responsive-black-theme/`
**Prerequisites**: plan.md (completed), spec.md (completed)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. These tasks reflect the work already present in the codebase.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (Next.js frontend/, FastAPI backend/)
- [x] T002 Initialize Python project with UV and Node with npm/Next.js
- [x] T003 [P] Configure Tailwind CSS v4 with custom theme support in frontend/postcss.config.mjs

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must be complete before any user story implementation

- [x] T004 Setup backend SQLModel schemas and SQLite database in backend/src/models/task.py
- [x] T005 [P] Implement JWT authentication framework (Phase II mock) in backend/src/dependencies/auth.py
- [x] T006 [P] Setup FastAPI routing and CORS middleware in backend/src/main.py
- [x] T007 Configure frontend Axios instance with auth interceptors in frontend/src/lib/api.ts
- [x] T008 [P] Implement ThemeProvider with localStorage persistence in frontend/src/app/provider.tsx

**Checkpoint**: Foundation ready - user story implementation complete.

---

## Phase 3: User Story 1 - Immersion in Dark Mode Productivity (Priority: P1) 🎯 MVP

**Goal**: Implement a pure black (#000000) dashboard with Inter/Poppins typography.

**Independent Test**: Verify that the dashboard at `/todos` renders with a #000000 background and high-contrast text.

### Implementation for User Story 1

- [x] T009 [P] [US1] Define pure black theme variables in frontend/src/app/globals.css
- [x] T010 [US1] Integrate Inter and Poppins fonts in frontend/src/app/layout.tsx
- [x] T011 [US1] Implement responsive layout wrapper with ambient glow effects in frontend/src/app/todos/page.tsx
- [x] T012 [P] [US1] Create minimalist task card component in frontend/src/components/TodoItem.tsx
- [x] T013 [US1] Implement task CRUD integration (List, Add, Toggle, Delete) in frontend dashboard

**Checkpoint**: User Story 1 (Dark Dashboard) is fully functional.

---

## Phase 4: User Story 2 - Professional Entry Point (Priority: P1)

**Goal**: Create centered, glassmorphic auth cards for login and signup.

**Independent Test**: Navigate to `/login` and verify the centered card with backdrop blur and modern typography.

### Implementation for User Story 2

- [x] T014 [US2] Create responsive AuthCard wrapper in frontend/src/components/AuthCard.tsx
- [x] T015 [US2] Implement Login page with mock JWT submission in frontend/src/app/login/page.tsx
- [x] T016 [US2] Implement Signup page with routing to login in frontend/src/app/signup/page.tsx

**Checkpoint**: User Story 2 (Auth Flow) is functional.

---

## Phase 5: User Story 3 - Motivational Workspace Organization (Priority: P2)

**Goal**: Persistent sidebar navigation and empty state UX.

**Independent Test**: Verify sidebar appears on desktop and as a drawer on mobile; verify empty state when no tasks exist.

### Implementation for User Story 3

- [x] T017 [US3] Implement responsive Sidebar with navigation links in frontend/src/components/Sidebar.tsx
- [x] T018 [US3] Add Header component with search bar and user profile in frontend/src/components/Header.tsx
- [x] T019 [P] [US3] Implement "Empty Workspace" state in frontend/src/app/todos/page.tsx

**Checkpoint**: All user stories from spec 006 are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 [P] Ensure mobile responsiveness across all components (breakpoints check)
- [x] T021 Update landing page (frontend/src/app/page.tsx) to match 006 theme (currently light blue)
- [ ] T022 Implement real JWT generation in backend (currently mock)
- [ ] T023 Add documentation for the new responsive dashboard structure
- [ ] T024 Run accessibility audit (WCAG AA check)

---

## Dependencies & Execution Order

1. **Setup & Foundation**: Completed.
2. **User Stories 1 & 2**: Completed (Core UI and Auth).
3. **User Story 3**: Completed (Navigation and States).
4. **Polish**: Partial (Dashboard complete, Home page and real auth pending).
