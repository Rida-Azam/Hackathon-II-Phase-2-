---

description: "Task list for 009-task-enhancements"
---

# Tasks: Task Priority, Category, Due Dates & Enhanced Filtering

**Input**: Design documents from `/specs/009-task-enhancements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly required. Focus on manual validation flows described in quickstart.md.

**Organization**: Tasks are grouped by user story so each can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Task can run in parallel (different files, no blocking dependencies)
- **[Story]**: User story label (US1 = priority management, US2 = search/filter & reminders, US3 = calendar view)
- All descriptions include exact file paths.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure repo and environment are ready for implementation.

- [ ] T001 Verify backend env config and DB connectivity per `backend/src/core/db.py`
- [ ] T002 Verify frontend dev server baseline behavior (`frontend/src/app/todos/page.tsx` loads current tasks)
- [ ] T003 [P] Capture reference screenshots before changes for regression comparison (store under `history/screenshots/`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data/model changes required before user stories.

- [ ] T004 Update SQLModel Task schema in `backend/src/models/task.py` with priority/category/due_date fields per `data-model.md`
- [ ] T005 Document Neon ALTER TABLE migration snippet in `backend/README.md` (or existing ops doc) referencing `data-model.md`
- [ ] T006 [P] Extend TypeScript `Task` interface plus Priority/Category types in `frontend/src/types/todo.ts`
- [ ] T007 [P] Verify `/api/todos/` responses now include new fields via manual curl/Postman request (log sample payload in `history/testing/api-verification.md`)

**Checkpoint**: Backend + shared types ready; user stories can proceed.

---

## Phase 3: User Story 1 – Create & Manage Task Priority (Priority: P1) 🎯 MVP

**Goal**: Users can set and edit priority/category/due date, and see them on task cards.
**Independent Test**: Create tasks with each priority/category, verify defaults, edit existing tasks, confirm badges render in `TodoItem`.

### Implementation
- [ ] T008 [US1] Add new task form controls (priority/category/due date) in `frontend/src/app/todos/page.tsx` per quickstart instructions
- [ ] T009 [US1] Persist new form state fields and reset logic in `frontend/src/app/todos/page.tsx`
- [ ] T010 [US1] Update `handleAddTodo` payload to POST new fields in `frontend/src/app/todos/page.tsx`
- [ ] T011 [US1] Update `handleUpdate` signature and API calls to include new fields in `frontend/src/app/todos/page.tsx`
- [ ] T012 [US1] Enhance `TodoItem` display with priority/category/due-date badges in `frontend/src/components/TodoItem.tsx`
- [ ] T013 [US1] Extend `TodoItem` edit mode to edit priority/category/due date in `frontend/src/components/TodoItem.tsx`
- [ ] T014 [US1] Add visual styles for new badges in `frontend/src/components/TodoItem.tsx` (Tailwind classes consistent with dark theme)
- [ ] T015 [US1] Manual validation: create/edit tasks with all field combinations and capture evidence in `history/testing/us1-validation.md`

**Checkpoint**: US1 independently functional (MVP deliverable).

---

## Phase 4: User Story 2 – Filters, Reminders & Sidebar (Priority: P1)

**Goal**: Enable search/filter controls, reminder list, and sidebar update.
**Independent Test**: Apply filters to task list, verify reminder page shows correct subset, confirm sidebar menu without "Notes".

### Implementation
- [ ] T016 [US2] Remove "Notes" entry from navItems in `frontend/src/components/Sidebar.tsx`
- [ ] T017 [US2] Add search/filter state hooks in `frontend/src/app/todos/page.tsx` (searchQuery, filterPriority, etc.)
- [ ] T018 [US2] Implement derived `filteredTodos` logic with priority/category/due-date filtering in `frontend/src/app/todos/page.tsx`
- [ ] T019 [US2] Render search input + filter dropdowns + clear button UI in `frontend/src/app/todos/page.tsx`
- [ ] T020 [US2] Update task list rendering to use `filteredTodos` and add "No tasks match filters" empty state in `frontend/src/app/todos/page.tsx`
- [ ] T021 [US2] Create reminders page skeleton at `frontend/src/app/reminders/page.tsx` with auth guard + data fetch reuse
- [ ] T022 [US2] Implement reminder filtering logic (high priority OR due within 7 days) in `frontend/src/app/reminders/page.tsx`
- [ ] T023 [US2] Render reminder tasks using `TodoItem` plus empty-state visuals in `frontend/src/app/reminders/page.tsx`
- [ ] T024 [US2] Manual validation: screenshot filter bar, reminders list, sidebar nav for artifact `history/testing/us2-validation.md`

**Checkpoint**: Filters & reminders independently demonstrable.

---

## Phase 5: User Story 3 – Calendar View (Priority: P2)

**Goal**: Provide calendar page with monthly grid, date indicators, and date-filtered task list.
**Independent Test**: Navigate calendar months, click dates with tasks, verify detail pane lists matching tasks.

### Implementation
- [ ] T025 [US3] Scaffold calendar page route at `frontend/src/app/calendar/page.tsx` with shared layout components
- [ ] T026 [US3] Implement month navigation + day grid generator in `frontend/src/app/calendar/page.tsx`
- [ ] T027 [US3] Add task indicator dots/counts on calendar cells and date selection state in `frontend/src/app/calendar/page.tsx`
- [ ] T028 [US3] Render selected-date task summaries and detailed list using `TodoItem` in `frontend/src/app/calendar/page.tsx`
- [ ] T029 [US3] Ensure calendar view reuses existing update/delete/toggle handlers for consistency in `frontend/src/app/calendar/page.tsx`
- [ ] T030 [US3] Manual validation: produce walkthrough notes/screenshots for calendar interactions (`history/testing/us3-validation.md`)

**Checkpoint**: Calendar view independently validated.

---

## Phase 6: Polish & Cross-Cutting

- [ ] T031 [P] Update documentation references (README, quickstart links) noting new reminders/calendar routes
- [ ] T032 [P] Run end-to-end smoke test following `quickstart.md` checklist; log outcomes in `history/testing/smoke.md`
- [ ] T033 Review Lighthouse/accessibility impact on new UI sections (record in `history/testing/a11y.md`)
- [ ] T034 Final regression pass comparing pre/post screenshots stored in `history/screenshots/`

---

## Dependencies & Execution Order

1. **Phase 1 → Phase 2**: Setup must precede foundational schema/type work.
2. **Phase 2 → Phase 3/4/5**: Foundational tasks unblock all user stories.
3. **User Story Priority**: US1 (MVP) → US2 → US3 (can run in parallel once Phase 2 finished, but ensure US1 completes before shipping MVP).
4. **Polish** tasks depend on completion of targeted user stories.

### Parallel Opportunities
- T003, T006, T007 can run concurrently (different files).
- Within US1: T008–T014 touch different sections and can be split among developers carefully, but respect state dependencies (form logic before display updates).
- US2 and US3 pages can be developed concurrently after Phase 2 since they live in separate routes/files.

---

## Implementation Strategy

1. **MVP Delivery**: Complete Phases 1–3; ship priority/category/due-date support.
2. **Incremental Enhancements**: Add Phase 4 (filters/reminders) next, validate, then Phase 5 (calendar).
3. **Final Polish**: Execute Phase 6 to ensure documentation and QA evidence are updated.

---

**Total Tasks**: 34
- US1: 8 tasks
- US2: 9 tasks
- US3: 6 tasks
- Others (setup/foundational/polish): 11 tasks

**Independent Tests**:
- US1: `history/testing/us1-validation.md` checklist
- US2: `history/testing/us2-validation.md` artifacts
- US3: `history/testing/us3-validation.md` walkthrough

**Parallel Opportunities**: Highlighted per phase; especially Phase 2 tasks and entire US2 vs US3 once foundation ready.

**Suggested MVP**: Complete through Phase 3 (User Story 1) before expanding scope.

**Format Validation**: All tasks follow `- [ ] T### [P?] [Story?] Description` with explicit file paths.
