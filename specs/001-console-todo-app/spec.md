# Feature Specification: Phase I Console Todo Application

**Feature Branch**: `001-console-todo-app`
**Created**: 2025-12-30
**Status**: Draft
**Input**: Phase I In-Memory Python Console Todo Application for Evolution of Todo Hackathon II

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add New Task (Priority: P1)

As a user, I want to add a new task so that I can track things I need to do.

**Why this priority**: This is the foundational feature - without the ability to add tasks, no other features have meaning. A todo app with only "add" is still minimally useful.

**Independent Test**: Can be fully tested by running the application, selecting "Add Task", entering a title and optional description, and verifying the task appears in the list with a unique ID.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** user selects "Add Task" and enters title "Buy groceries", **Then** system displays "Task 1 added: Buy groceries" and task is stored with ID 1, title "Buy groceries", empty description, and completed=False.

2. **Given** a task with ID 1 already exists, **When** user adds another task with title "Call mom", **Then** system assigns ID 2 (never reuses ID 1 even if task 1 was deleted).

3. **Given** user is adding a task, **When** user enters only whitespace for title, **Then** system displays "Title is required." and returns to menu without creating task.

4. **Given** user is adding a task, **When** user enters a valid title and presses Enter for description (empty), **Then** system creates task with empty description.

5. **Given** user is adding a task, **When** user enters a description longer than 1000 characters, **Then** system displays "Description must be 1000 characters or less." and prompts again.

---

### User Story 2 - View All Tasks (Priority: P1)

As a user, I want to see all my tasks so that I know what is pending and completed.

**Why this priority**: Equally critical as adding - users need immediate feedback that their tasks are being tracked. Viewing enables verification of all other operations.

**Independent Test**: Can be fully tested by adding several tasks and selecting "View Tasks" to verify all tasks display with correct ID, title, and status indicators.

**Acceptance Scenarios**:

1. **Given** no tasks exist, **When** user selects "View Tasks", **Then** system displays "No tasks yet."

2. **Given** tasks exist with various completion states, **When** user selects "View Tasks", **Then** system displays all tasks in a readable format showing ID, title, and status (e.g., `[ ]` for pending, `[x]` for completed).

3. **Given** tasks with descriptions exist, **When** user views tasks, **Then** descriptions are shown (truncated if necessary for readability).

---

### User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

As a user, I want to toggle a task's completion status so that I can track my progress.

**Why this priority**: Core to the purpose of a todo app - tracking what's done. Depends on tasks existing (P1 stories) but provides the primary value proposition.

**Independent Test**: Can be fully tested by adding a task, toggling its status, and verifying the status changes in the task list.

**Acceptance Scenarios**:

1. **Given** a task with ID 1 exists and is incomplete (completed=False), **When** user selects "Mark Complete/Incomplete" and enters ID 1, **Then** task status toggles to completed=True and system displays "Task 1 marked as complete."

2. **Given** a task with ID 1 exists and is complete (completed=True), **When** user selects "Mark Complete/Incomplete" and enters ID 1, **Then** task status toggles to completed=False and system displays "Task 1 marked as incomplete."

3. **Given** user enters a non-existent task ID (e.g., 999), **When** user attempts to toggle status, **Then** system displays "Task with ID 999 not found." and returns to menu.

---

### User Story 4 - Update Task (Priority: P3)

As a user, I want to change a task's title or description so that I can correct or update information.

**Why this priority**: Important for maintaining accurate task information, but less critical than core add/view/complete workflow.

**Independent Test**: Can be fully tested by adding a task, updating its title and/or description, and verifying changes persist in the task list.

**Acceptance Scenarios**:

1. **Given** a task with ID 1 exists with title "Buy groceries", **When** user selects "Update Task", enters ID 1, and enters new title "Buy organic groceries", **Then** system updates title and displays "Task 1 updated."

2. **Given** user is updating a task, **When** user presses Enter without entering a new title, **Then** system keeps the original title unchanged.

3. **Given** user is updating a task, **When** user presses Enter without entering a new description, **Then** system keeps the original description unchanged.

4. **Given** user enters a non-existent task ID, **When** user attempts to update, **Then** system displays "Task with ID [x] not found." and returns to menu.

5. **Given** user enters non-integer input for ID, **When** prompted for task ID, **Then** system displays "Please enter a valid number." and returns to menu.

---

### User Story 5 - Delete Task (Priority: P3)

As a user, I want to remove a task so that I can clean up completed or irrelevant items.

**Why this priority**: Useful for list maintenance but not essential for basic task tracking functionality.

**Independent Test**: Can be fully tested by adding a task, deleting it with confirmation, and verifying it no longer appears in the task list.

**Acceptance Scenarios**:

1. **Given** a task with ID 1 exists with title "Buy groceries", **When** user selects "Delete Task", enters ID 1, and confirms with "y", **Then** task is removed and system displays "Task 1 deleted."

2. **Given** user is prompted to confirm deletion, **When** user enters "n", **Then** system displays "Deletion cancelled." and task remains in list.

3. **Given** user enters a non-existent task ID, **When** user attempts to delete, **Then** system displays "Task with ID [x] not found." and returns to menu.

4. **Given** task with ID 1 was deleted, **When** user adds a new task, **Then** new task receives ID 2 (ID 1 is never reused).

---

### User Story 6 - Application Navigation (Priority: P1)

As a user, I want a clear menu-based interface so that I can easily navigate between features.

**Why this priority**: Essential infrastructure - without navigation, users cannot access any features. The menu is the entry point to all functionality.

**Independent Test**: Can be fully tested by running the application and verifying the menu displays, accepts valid choices, rejects invalid choices gracefully, and allows clean exit.

**Acceptance Scenarios**:

1. **Given** the application starts, **When** main screen loads, **Then** system displays a welcome message and numbered menu with all options (Add, View, Update, Delete, Toggle Complete, Exit).

2. **Given** the menu is displayed, **When** user enters a valid menu number, **Then** system executes the corresponding action and returns to menu afterward.

3. **Given** the menu is displayed, **When** user enters an invalid choice (e.g., "abc" or "99"), **Then** system displays "Invalid choice. Please enter a number from the menu." and redisplays menu.

4. **Given** user selects Exit option, **When** exit is confirmed, **Then** application terminates cleanly with a goodbye message.

---

### Edge Cases

- **Empty title validation**: Title containing only whitespace is rejected with "Title is required."
- **Title length boundary**: Title must be 1-200 characters after stripping whitespace; titles exceeding 200 characters are rejected.
- **Description length boundary**: Description exceeding 1000 characters is rejected with clear error message.
- **Non-integer ID input**: Any non-numeric input when ID is expected results in "Please enter a valid number."
- **ID not found**: Operations on non-existent IDs display "Task with ID [x] not found."
- **Empty task list operations**: View shows friendly "No tasks yet." message; other operations handle empty list gracefully.
- **ID reuse prevention**: Deleted task IDs are never reassigned to new tasks.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a menu-based command-line interface with numbered options for all operations.
- **FR-002**: System MUST allow users to add tasks with a required title (1-200 characters) and optional description (max 1000 characters).
- **FR-003**: System MUST assign unique, auto-incrementing integer IDs to tasks starting from 1, never reusing IDs after deletion.
- **FR-004**: System MUST display all tasks in a readable format showing ID, title, completion status, and optionally description.
- **FR-005**: System MUST allow users to update a task's title and/or description by ID, keeping original values when user skips input.
- **FR-006**: System MUST allow users to delete a task by ID with confirmation prompt (y/n).
- **FR-007**: System MUST allow users to toggle a task's completion status between complete and incomplete.
- **FR-008**: System MUST validate all user inputs and display helpful error messages without crashing.
- **FR-009**: System MUST display the menu after each action until user explicitly chooses to exit.
- **FR-010**: System MUST terminate cleanly when user selects exit, displaying a goodbye message.
- **FR-011**: System MUST store all tasks in memory only (no persistence between application runs).

### Key Entities

- **Task**: Represents a todo item with the following attributes:
  - **id** (integer): Unique identifier, auto-incrementing from 1, never reused
  - **title** (string): Required, 1-200 characters after trimming whitespace
  - **description** (string): Optional, maximum 1000 characters, defaults to empty
  - **completed** (boolean): Completion status, defaults to False

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new task in under 30 seconds (enter title, optional description, see confirmation).
- **SC-002**: Users can view their complete task list in a single action (one menu selection).
- **SC-003**: Users can mark a task complete/incomplete in under 15 seconds (select option, enter ID, see confirmation).
- **SC-004**: 100% of invalid inputs result in helpful error messages rather than application crashes.
- **SC-005**: Application maintains session state correctly (all added tasks remain visible until exit).
- **SC-006**: Zero data persists after application exit (verified by restarting and seeing empty list).
- **SC-007**: All 5 core features (add, view, update, delete, toggle) function end-to-end without errors.
- **SC-008**: Menu navigation completes full loop (action → result → menu) for every operation.

## Constraints & Assumptions

### Constraints (from Constitution)

- Single user only (no authentication, no user accounts)
- In-memory storage only (no databases, no files, no persistence)
- Pure Python 3.13+ standard library only (no external packages)
- CLI interface only (no web, no API, no GUI)
- Basic features only (no priorities, tags, due dates, search, sort, reminders)

### Assumptions

- Users have basic familiarity with command-line interfaces
- Console supports standard input/output (stdin/stdout)
- Single session usage (user completes tasks within one application run)
- Task IDs are displayed as simple integers without formatting
- Confirmation prompts accept lowercase 'y' and 'n' (case-insensitive recommended)

## Non-Goals / Explicit Exclusions

- No saving/loading from disk
- No multi-user support
- No colors, rich formatting, or external terminal libraries
- No priorities, tags, or categories
- No due dates or reminders
- No search or filter functionality
- No sorting options
- No undo/redo functionality
- No recurring tasks
- No API or web interface
