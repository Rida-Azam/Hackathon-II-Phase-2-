---
description: "Implementation tasks for UI/UX enhancements"
---

# Tasks: UI/UX Enhancement

**Input**: Design documents from `/specs/004-ui-ux-enhancement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Manual verification using `specs/004-ui-ux-enhancement/quickstart.md`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Import Inter and Poppins fonts in frontend/src/app/layout.tsx
- [x] T002 [P] Update fonts in tailwind.config.ts to inclusion custom font families
- [x] T003 [P] Add CSS variables for background and text colors in frontend/src/styles/globals.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create frontend/src/app/provider.tsx for theme management
- [x] T005 [P] Create frontend/src/app/ThemeScript.js to prevent dark mode flicker
- [x] T006 [P] Add theme toggle component in frontend/src/components/ThemeToggle.tsx
- [x] T007 Integrate ThemeProvider and ThemeScript in frontend/src/app/layout.tsx
- [x] T008 [P] Configure Tailwind `darkMode: 'class'` in tailwind.config.ts
- [x] T009 [P] Create frontend/src/components/Toast.tsx specifically for the new UI

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Modernized Authentication Flow (Priority: P1) 🎯 MVP

**Goal**: Deliver a premium login and signup experience with glassmorphism cards and smooth input feedback.

**Independent Test**: Visit /login and /signup pages, verify card glassmorphism effect and focus glow around inputs.

### Implementation for User Story 1

- [x] T010 [P] [US1] Redesign login page card in frontend/src/app/login/page.tsx
- [x] T011 [P] [US1] Redesign signup page card in frontend/src/app/signup/page.tsx
- [x] T012 [US1] Implement premium input fields with focus glow in login/signup pages
- [x] T013 [US1] Add loading spinner to auth buttons during submission
- [x] T014 [US1] Apply hover and active scale animations to auth buttons
- [x] T015 [US1] Center auth forms and add blurred gradient background
- [x] T016 [US1] Refine error messaging layout and typography in auth pages
- [x] T017 [US1] Add fade-in entry animation for auth cards

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Dark & Light Theme System (Priority: P1)

**Goal**: Implement a complete, persisting theme toggle that updates consistent colors across the entire app.

**Independent Test**: Click theme toggle in header, verify color swap between dark (#0f0f0f) and light (#ffffff), and persistence upon refresh.

### Implementation for User Story 2

- [x] T018 [US2] Update frontend/src/app/todos/page.tsx with dark: prefix classes
- [x] T019 [US2] Update frontend/src/components/TodoItem.tsx with dark: prefix classes
- [x] T020 [US2] Ensure all layout elements (headers, footers) have dark mode support
- [x] T021 [US2] Implement Sun/Moon transition animation in ThemeToggle.tsx
- [x] T022 [US2] Verify localStorage theme persistence across route changes
- [x] T023 [US2] Audit all hardcoded color values and replace with Tailwind semantic classes

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Motivating Todo Dashboard (Priority: P1)

**Goal**: Transform the /todos dashboard into a clean, táctile, and visually motivating interface.

**Independent Test**: Add/Edit/Delete tasks and verify tactile feedback (card lift) and success toast notifications.

### Implementation for User Story 3

- [x] T024 [US3] Redesign /todos dashboard header layout in frontend/src/app/todos/page.tsx
- [x] T025 [P] [US3] Create modern empty state with Lucide icons in frontend/src/app/todos/page.tsx
- [x] T026 [US3] Implement card-lift hover effect in frontend/src/components/TodoItem.tsx
- [x] T027 [US3] Integrate Toast component into the task CRUD flow in frontend/src/app/todos/page.tsx
- [x] T028 [US3] Add skeleton loaders for initial task fetch in frontend/src/app/todos/page.tsx
- [x] T029 [US3] Ensure perfect mobile responsiveness for the task grid/list
- [x] T030 [P] [US3] Implement custom confirmation Modal in frontend/src/components/Modal.tsx
- [x] T031 [US3] Replace native confirm with new Modal in frontend/src/app/todos/page.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final visual refinements and quality audit

- [x] T032 [P] Perform accessibility sweep (contrast, ARIA labels)
- [x] T033 Code cleanup and Tailwind class consolidation
- [x] T034 [P] Performance optimization (minify fonts, check bundle size)
- [x] T035 Final walkthrough using spec/quickstart.md scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on User Stories being complete

### Parallel Opportunities

- All Foundational tasks [P] can run in parallel (T005, T006, T008, T009)
- Auth implementation (US1) and Dashboard implementation (US3) can start independently once Foundation is ready.
- Backend has no changes, so all frontend tasks can proceed without backend blocks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Auth Modernization)
4. **STOP and VALIDATE**: Verify login/signup look premium.

### Incremental Delivery

1. Foundation ready
2. Add Theme System (US2) → Test persistence
3. Add Dashboard UI (US3) → Test CRUD tactile feedback
4. Apply Polish
