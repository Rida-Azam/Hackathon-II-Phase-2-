---
description: "Implementation tasks for fixing edit and delete todo functionality"
---

# Tasks: Fix Edit and Delete Todo Functionality

**Input**: Design documents from `/specs/003-fix-edit-delete/`
**Prerequisites**: plan.md (completed), spec.md (completed)

**Tests**: Manual testing only - no automated tests in Phase II

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This project follows a web app structure:
- Frontend: `frontend/src/`
- Backend: `backend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Status**: ✅ All setup already complete - no tasks needed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Status**: ✅ All foundational components already working:
- Database schema exists (tasks table)
- Authentication working (Better Auth + mock token bypass)
- API routing configured (FastAPI)
- Frontend routing configured (Next.js App Router)
- Error handling infrastructure exists (error banners in todos page)
- axios client configured with interceptors

**⚠️ CRITICAL**: Foundation is complete - user story implementation can begin immediately

---

## Phase 3: User Story 1 - Edit Existing Todo (Priority: P1) 🎯 MVP

**Goal**: Allow users to modify todo title and description, with changes persisting after save

**Independent Test**: Create a todo, click edit, change the title/description, save, and verify the changes persist after page refresh

### Implementation for User Story 1

- [X] T001 [US1] Add isProcessing state to todos page in frontend/src/app/todos/page.tsx
- [X] T002 [US1] Implement handleUpdate function with try/catch in frontend/src/app/todos/page.tsx
- [X] T003 [US1] Add console logging to handleUpdate function in frontend/src/app/todos/page.tsx
- [X] T004 [US1] Call PUT /api/todos/{id}/ with title and description in frontend/src/app/todos/page.tsx
- [X] T005 [US1] Handle success response by calling fetchTodos() in frontend/src/app/todos/page.tsx
- [X] T006 [US1] Handle error response by setting error state in frontend/src/app/todos/page.tsx
- [X] T007 [US1] Wire handleUpdate to TodoItem onUpdate prop in frontend/src/app/todos/page.tsx
- [X] T008 [P] [US1] Add debug logging to PUT endpoint in backend/src/api/routes/todos.py
- [X] T009 [P] [US1] Validate PUT endpoint updates title and description fields in backend/src/api/routes/todos.py
- [X] T010 [P] [US1] Ensure PUT endpoint updates updated_at timestamp in backend/src/api/routes/todos.py
- [X] T011 [P] [US1] Verify PUT endpoint returns complete updated todo object in backend/src/api/routes/todos.py

### Manual Tests for User Story 1

- [ ] T012 [US1] Manual test: Create todo, edit title only, save, verify change persists
- [ ] T013 [US1] Manual test: Create todo, edit description only, save, verify change persists
- [ ] T014 [US1] Manual test: Create todo, edit both title and description, save, verify changes persist
- [ ] T015 [US1] Manual test: Open edit form, cancel without saving, verify no changes made
- [ ] T016 [US1] Manual test: Edit todo, refresh page, verify changes persist after reload

**Checkpoint**: At this point, edit functionality should be fully working and independently testable

---

## Phase 4: User Story 2 - Delete Unwanted Todo (Priority: P1)

**Goal**: Allow users to permanently remove todos with confirmation dialog to prevent accidents

**Independent Test**: Create a todo, click delete, confirm the deletion, verify the todo is removed and does not reappear after page refresh

### Implementation for User Story 2

- [X] T017 [US2] Implement handleDelete function with confirmation dialog in frontend/src/app/todos/page.tsx
- [X] T018 [US2] Add window.confirm() check before executing delete in frontend/src/app/todos/page.tsx
- [X] T019 [US2] Add try/catch error handling to handleDelete in frontend/src/app/todos/page.tsx
- [X] T020 [US2] Add console logging to handleDelete function in frontend/src/app/todos/page.tsx
- [X] T021 [US2] Call DELETE /api/todos/{id}/ in handleDelete in frontend/src/app/todos/page.tsx
- [X] T022 [US2] Handle success response by calling fetchTodos() in frontend/src/app/todos/page.tsx
- [X] T023 [US2] Handle error response by setting error state in frontend/src/app/todos/page.tsx
- [X] T024 [US2] Wire handleDelete to TodoItem onDelete prop in frontend/src/app/todos/page.tsx
- [X] T025 [P] [US2] Add debug logging to DELETE endpoint in backend/src/api/routes/todos.py
- [X] T026 [P] [US2] Verify DELETE endpoint removes todo from database in backend/src/api/routes/todos.py
- [X] T027 [P] [US2] Ensure DELETE endpoint returns 204 No Content in backend/src/api/routes/todos.py

### Manual Tests for User Story 2

- [ ] T028 [US2] Manual test: Create todo, click delete, confirm, verify todo removed from list
- [ ] T029 [US2] Manual test: Create todo, click delete, cancel, verify todo remains in list
- [ ] T030 [US2] Manual test: Delete todo, refresh page, verify deleted todo does not reappear
- [ ] T031 [US2] Manual test: Verify confirmation dialog shows clear message before deletion

**Checkpoint**: At this point, delete functionality should be fully working and independently testable

---

## Phase 5: User Story 3 - Prevent Accidental Data Loss (Priority: P2)

**Goal**: Ensure users cannot lose data through double-clicks, network errors, or premature actions

**Independent Test**: Rapidly click save/delete buttons, stop backend during operations, verify proper loading states and error messages

### Implementation for User Story 3

- [X] T032 [US3] Implement handleToggle function with try/catch in frontend/src/app/todos/page.tsx
- [X] T033 [US3] Add console logging to handleToggle function in frontend/src/app/todos/page.tsx
- [X] T034 [US3] Call PATCH /api/todos/{id}/complete/ in handleToggle in frontend/src/app/todos/page.tsx
- [X] T035 [US3] Handle success response by calling fetchTodos() in frontend/src/app/todos/page.tsx
- [X] T036 [US3] Handle error response by setting error state in frontend/src/app/todos/page.tsx
- [X] T037 [US3] Wire handleToggle to TodoItem onToggle prop in frontend/src/app/todos/page.tsx
- [X] T038 [US3] Set isProcessing=true at start of each handler in frontend/src/app/todos/page.tsx
- [X] T039 [US3] Set isProcessing=false in finally blocks of each handler in frontend/src/app/todos/page.tsx
- [X] T040 [US3] Pass isProcessing to TodoItem to disable buttons during operations in frontend/src/app/todos/page.tsx

### Manual Tests for User Story 3

- [ ] T041 [US3] Manual test: Rapidly click save button during edit, verify only one request sent
- [ ] T042 [US3] Manual test: Rapidly click delete button, verify only one request sent
- [ ] T043 [US3] Manual test: Stop backend, try to edit todo, verify error message appears
- [ ] T044 [US3] Manual test: Stop backend, try to delete todo, verify error message appears
- [ ] T045 [US3] Manual test: Click save, verify button shows loading state and is disabled
- [ ] T046 [US3] Manual test: Network error during edit, verify form remains open with changes intact

**Checkpoint**: All user stories should now be independently functional with proper error handling

---

## Phase 6: Polish & Validation

**Purpose**: Final validation and documentation

- [X] T047 [P] Verify all console logging includes todo.id for traceability
- [X] T048 [P] Check that error messages are user-friendly and actionable
- [X] T049 [P] Verify trailing slashes on all API endpoints (/api/todos/{id}/)
- [ ] T050 [P] Test complete user flow: login → create → edit → delete → logout
- [ ] T051 Verify all acceptance criteria from spec.md are met
- [X] T052 Review backend logs for any unhandled errors during operations
- [ ] T053 Test that page refresh after each operation shows correct state

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ Already complete - no tasks
- **Foundational (Phase 2)**: ✅ Already complete - no tasks
- **User Stories (Phase 3-5)**: Can start immediately - foundation is ready
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order: US1 (Edit) → US2 (Delete) → US3 (Error Handling)
- **Polish (Phase 6)**: Depends on all three user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Edit)**: Can start immediately - No dependencies
- **User Story 2 (P2 - Delete)**: Can start after US1 OR in parallel - Independent
- **User Story 3 (P3 - Error Handling)**: Should start after US1 and US2 - Adds loading/error states to existing handlers

**Recommended Order**: US1 → US2 → US3 → Polish

### Within Each User Story

- Frontend handler implementation comes first (T001-T007 for US1)
- Backend logging/validation can happen in parallel (marked [P])
- Manual tests follow implementation completion
- Each story should be fully tested before moving to next

### Parallel Opportunities

**User Story 1 Backend Tasks** (after T007):
```bash
# All backend validation for US1 can run in parallel:
Task T008: Add debug logging to PUT endpoint
Task T009: Validate PUT endpoint updates fields
Task T010: Ensure updated_at timestamp
Task T011: Verify complete object returned
```

**User Story 2 Backend Tasks** (after T024):
```bash
# All backend validation for US2 can run in parallel:
Task T025: Add debug logging to DELETE endpoint
Task T026: Verify deletion from database
Task T027: Ensure 204 No Content response
```

**Polish Phase**:
```bash
# All polish tasks can run in parallel:
Task T047: Verify console logging
Task T048: Check error messages
Task T049: Verify trailing slashes
Task T050: Test complete user flow
```

**Cross-Story Parallelism** (if multiple developers):
- Developer A: Complete User Story 1 (T001-T016)
- Developer B: Complete User Story 2 (T017-T031) - can start in parallel
- Then merge and Developer C: Complete User Story 3 (T032-T046)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Setup already complete
2. ✅ Foundational already complete
3. Complete Phase 3: User Story 1 (Edit functionality) - T001 through T016
4. **STOP and VALIDATE**: Test edit independently with manual tests
5. User can now edit todos - core CRUD functionality restored

### Incremental Delivery

1. ✅ Setup + Foundational → Already complete
2. Add User Story 1 (Edit) → Test independently → Core edit working (MVP!)
3. Add User Story 2 (Delete) → Test independently → Full CRUD complete
4. Add User Story 3 (Error Handling) → Test independently → Production-ready
5. Polish phase → Verify all success criteria met

### Sequential Implementation (Recommended for Solo Developer)

1. Complete T001-T016 (User Story 1: Edit) - Test edit flow thoroughly
2. Complete T017-T031 (User Story 2: Delete) - Test delete flow thoroughly
3. Complete T032-T046 (User Story 3: Error Handling) - Test error scenarios
4. Complete T047-T053 (Polish) - Final validation

### Parallel Team Strategy (If Multiple Developers Available)

With 2 developers:
1. Developer A: User Story 1 (Edit) - T001-T016
2. Developer B: User Story 2 (Delete) - T017-T031 (can work in parallel)
3. Both: User Story 3 (Error Handling) - T032-T046 (adds to both handlers)
4. Both: Polish - T047-T053

---

## Notes

- [P] tasks = different files, no dependencies on each other
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each logical group (all frontend tasks, all backend tasks, all manual tests)
- Stop at any checkpoint to validate story independently
- No automated tests required for Phase II - manual testing only
- All API endpoints require trailing slashes per FastAPI convention
- Use window.confirm() for delete confirmation (no custom modal in Phase II)
- Set isProcessing state to prevent double-clicks on all operations
- Always call fetchTodos() after successful operations to ensure UI sync with backend

## File Change Summary

**Files to Modify**:
1. `frontend/src/app/todos/page.tsx` - Add three handler functions (handleUpdate, handleDelete, handleToggle), wire to TodoItem, add isProcessing state
2. `backend/src/api/routes/todos.py` - Add debug logging to PUT and DELETE endpoints, validate operations

**Files NOT Changed**:
- `frontend/src/components/TodoItem.tsx` - Already has correct callback structure
- `frontend/src/lib/api.ts` - Axios client already configured
- `backend/src/models/task.py` - Task model already defined
- `backend/src/dependencies/auth.py` - Auth already working with mock tokens

**Total Tasks**: 53
- User Story 1 (Edit): 16 tasks (7 frontend + 4 backend + 5 manual tests)
- User Story 2 (Delete): 15 tasks (8 frontend + 3 backend + 4 manual tests)
- User Story 3 (Error Handling): 15 tasks (9 frontend + 6 manual tests)
- Polish: 7 tasks (validation and testing)

**Estimated Complexity**: Low-Medium
- Root cause identified: empty callback functions in parent component
- Solution straightforward: implement handler functions with API calls
- Existing infrastructure (axios, error handling, API endpoints) already in place
- Main work: wiring up handlers and adding proper error/loading states
