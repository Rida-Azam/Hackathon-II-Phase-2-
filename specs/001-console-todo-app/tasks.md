# Tasks: Phase I Console Todo Application

**Input**: Design documents from `/specs/001-console-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Tests are NOT explicitly requested in the specification. Test tasks are omitted per template guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure per implementation plan (src/, src/models/, src/services/, src/storage/, src/cli/)
- [ ] T002 [P] Create package marker src/__init__.py with module docstring
- [ ] T003 [P] Create package marker src/models/__init__.py
- [ ] T004 [P] Create package marker src/services/__init__.py
- [ ] T005 [P] Create package marker src/storage/__init__.py
- [ ] T006 [P] Create package marker src/cli/__init__.py

**Checkpoint**: Project structure ready - foundational phase can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create Task dataclass in src/models/task.py with id, title, description, completed fields and docstring
- [ ] T008 Create MemoryStore class in src/storage/memory_store.py with _next_id counter and _tasks list
- [ ] T009 Implement MemoryStore.add() method in src/storage/memory_store.py - creates task with auto-incremented ID
- [ ] T010 Implement MemoryStore.get() method in src/storage/memory_store.py - returns task by ID or None
- [ ] T011 Implement MemoryStore.get_all() method in src/storage/memory_store.py - returns all tasks
- [ ] T012 [P] Create input validation functions in src/cli/validators.py - validate_title(), validate_description(), parse_int()
- [ ] T013 Create TaskService class in src/services/task_service.py with MemoryStore dependency injection

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Task (Priority: P1)

**Goal**: Users can add tasks with title and optional description, receiving unique auto-incremented IDs

**Independent Test**: Run app → select "Add Task" → enter title → verify task appears in list with unique ID

### Implementation for User Story 1

- [ ] T014 [US1] Implement TaskService.add_task() method in src/services/task_service.py - validates and adds task
- [ ] T015 [US1] Create handle_add_task() function in src/cli/handlers.py - prompts for title/description, calls service
- [ ] T016 [US1] Add title validation error handling in src/cli/handlers.py - "Title is required." message
- [ ] T017 [US1] Add description length validation in src/cli/handlers.py - "Description must be 1000 characters or less."
- [ ] T018 [US1] Add success confirmation output in src/cli/handlers.py - "Task {id} added: {title}"

**Checkpoint**: User Story 1 complete - users can add tasks

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Users can see all tasks with ID, title, and completion status in readable format

**Independent Test**: Add several tasks → select "View Tasks" → verify all display with correct status indicators

### Implementation for User Story 2

- [ ] T019 [US2] Implement TaskService.get_all_tasks() method in src/services/task_service.py - returns task list
- [ ] T020 [US2] Create handle_view_tasks() function in src/cli/handlers.py - displays formatted task list
- [ ] T021 [US2] Add empty list handling in src/cli/handlers.py - "No tasks yet." message
- [ ] T022 [US2] Add task formatting with status indicators in src/cli/handlers.py - [ ] pending, [x] completed

**Checkpoint**: User Stories 1 AND 2 complete - basic add/view workflow functional

---

## Phase 5: User Story 6 - Application Navigation (Priority: P1)

**Goal**: Users can navigate via numbered menu, with graceful error handling and clean exit

**Independent Test**: Run app → verify menu displays → test valid/invalid choices → test exit

### Implementation for User Story 6

- [ ] T023 [US6] Create display_menu() function in src/cli/menu.py - prints numbered menu options
- [ ] T024 [US6] Create display_welcome() function in src/cli/menu.py - prints welcome message
- [ ] T025 [US6] Create display_goodbye() function in src/cli/menu.py - prints goodbye message
- [ ] T026 [US6] Create main_loop() function in src/cli/menu.py - while True loop with choice dispatch
- [ ] T027 [US6] Add invalid choice handling in src/cli/menu.py - "Invalid choice. Please enter a number from the menu."
- [ ] T028 [US6] Create main() function in src/main.py - initializes services, calls main_loop
- [ ] T029 [US6] Add if __name__ == "__main__" block in src/main.py - entry point

**Checkpoint**: User Stories 1, 2, AND 6 complete - MVP functional (add, view, navigate)

---

## Phase 6: User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: Users can toggle task completion status by ID

**Independent Test**: Add task → toggle complete → verify status changed → toggle again → verify reverted

### Implementation for User Story 3

- [ ] T030 [US3] Implement MemoryStore.toggle_complete() method in src/storage/memory_store.py - flips completed flag
- [ ] T031 [US3] Implement TaskService.toggle_task() method in src/services/task_service.py - calls store method
- [ ] T032 [US3] Create handle_toggle_task() function in src/cli/handlers.py - prompts ID, toggles status
- [ ] T033 [US3] Add ID validation in handle_toggle_task() in src/cli/handlers.py - "Please enter a valid number."
- [ ] T034 [US3] Add task not found handling in src/cli/handlers.py - "Task with ID {id} not found."
- [ ] T035 [US3] Add toggle confirmation messages in src/cli/handlers.py - "Task {id} marked as complete/incomplete."

**Checkpoint**: User Story 3 complete - completion tracking functional

---

## Phase 7: User Story 4 - Update Task (Priority: P3)

**Goal**: Users can update task title and/or description, keeping original values when input skipped

**Independent Test**: Add task → update title only → verify → update description only → verify both changes

### Implementation for User Story 4

- [ ] T036 [US4] Implement MemoryStore.update() method in src/storage/memory_store.py - updates title/description
- [ ] T037 [US4] Implement TaskService.update_task() method in src/services/task_service.py - validates and updates
- [ ] T038 [US4] Create handle_update_task() function in src/cli/handlers.py - prompts ID, new values
- [ ] T039 [US4] Add keep-original-on-empty logic in src/cli/handlers.py - skip update if Enter pressed
- [ ] T040 [US4] Add update confirmation in src/cli/handlers.py - "Task {id} updated."

**Checkpoint**: User Story 4 complete - task editing functional

---

## Phase 8: User Story 5 - Delete Task (Priority: P3)

**Goal**: Users can delete tasks by ID with confirmation prompt

**Independent Test**: Add task → delete with confirm → verify removed → add another → verify ID not reused

### Implementation for User Story 5

- [ ] T041 [US5] Implement MemoryStore.delete() method in src/storage/memory_store.py - removes task, returns bool
- [ ] T042 [US5] Implement TaskService.delete_task() method in src/services/task_service.py - calls store method
- [ ] T043 [US5] Create handle_delete_task() function in src/cli/handlers.py - prompts ID and confirmation
- [ ] T044 [US5] Add confirmation prompt (y/n) in src/cli/handlers.py - case-insensitive
- [ ] T045 [US5] Add deletion cancelled message in src/cli/handlers.py - "Deletion cancelled."
- [ ] T046 [US5] Add deletion success message in src/cli/handlers.py - "Task {id} deleted."

**Checkpoint**: All user stories complete

---

## Phase 9: Polish & Integration

**Purpose**: Final integration, validation, and cleanup

- [ ] T047 Wire all handlers into main_loop() dispatch in src/cli/menu.py
- [ ] T048 Add handler imports to src/cli/__init__.py for clean module interface
- [ ] T049 Add service imports to src/services/__init__.py
- [ ] T050 Add model imports to src/models/__init__.py
- [ ] T051 Verify all error messages match spec exactly in src/cli/handlers.py
- [ ] T052 Manual end-to-end testing of all 5 features per quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1, US2, US6 can proceed in parallel (P1 priority)
  - US3 can start after Foundational (P2 priority)
  - US4, US5 can start after Foundational (P3 priority)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Add)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (View)**: Can start after Foundational - No dependencies on other stories
- **User Story 6 (Navigation)**: Can start after Foundational - Integrates US1, US2 handlers
- **User Story 3 (Toggle)**: Can start after Foundational - Uses Task model from US1
- **User Story 4 (Update)**: Can start after Foundational - Uses Task model from US1
- **User Story 5 (Delete)**: Can start after Foundational - Uses Task model from US1

### Within Each User Story

- Models before services
- Services before handlers
- Handlers before menu integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Foundational T012 (validators) can run in parallel with T007-T011
- User Stories 1, 2, 6 can run in parallel after Foundational
- User Stories 3, 4, 5 can run in parallel after Foundational

---

## Parallel Example: Setup Phase

```bash
# Launch all package markers together:
Task: "Create package marker src/__init__.py"
Task: "Create package marker src/models/__init__.py"
Task: "Create package marker src/services/__init__.py"
Task: "Create package marker src/storage/__init__.py"
Task: "Create package marker src/cli/__init__.py"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 6 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Add Task)
4. Complete Phase 4: User Story 2 (View Tasks)
5. Complete Phase 5: User Story 6 (Navigation)
6. **STOP and VALIDATE**: Test add/view/navigate independently
7. Deploy/demo if ready (MVP!)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 + 2 + 6 → Test independently → MVP!
3. Add User Story 3 (Toggle) → Test independently
4. Add User Story 4 (Update) → Test independently
5. Add User Story 5 (Delete) → Test independently
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1 + 2 (Add/View)
   - Developer B: User Story 6 (Navigation/Menu)
   - Developer C: User Stories 3, 4, 5 (Toggle/Update/Delete)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All error messages must match spec.md exactly
- ID reuse prevention is handled by MemoryStore._next_id counter (never decremented)
