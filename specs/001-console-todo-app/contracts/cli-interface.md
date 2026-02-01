# CLI Interface Contract: Phase I Console Todo Application

**Feature**: 001-console-todo-app
**Date**: 2025-12-30
**Type**: Command-Line Interface (not REST API)

## Overview

Phase I is a CLI application, not a web service. This document defines the user-facing interface contract for the console menu system.

## Menu Structure

```
=====================================
       TODO APPLICATION
=====================================

1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Complete/Incomplete
0. Exit

Enter your choice:
```

## Operations

### 1. Add Task

**Input Flow**:
```
Enter your choice: 1
Enter task title: <user input>
Enter task description (press Enter to skip): <user input or empty>
```

**Output**:
- Success: `Task {id} added: {title}`
- Error (empty title): `Title is required.`
- Error (title too long): `Title must be 200 characters or less.`
- Error (description too long): `Description must be 1000 characters or less.`

---

### 2. View Tasks

**Input Flow**:
```
Enter your choice: 2
```

**Output** (with tasks):
```
=====================================
           YOUR TASKS
=====================================
ID  | Status | Title
----|--------|---------------------------
1   | [x]    | Buy groceries
2   | [ ]    | Call mom
3   | [ ]    | Review PR
=====================================
```

**Output** (no tasks):
```
No tasks yet.
```

---

### 3. Update Task

**Input Flow**:
```
Enter your choice: 3
Enter task ID to update: <user input>
Enter new title (press Enter to keep current): <user input or empty>
Enter new description (press Enter to keep current): <user input or empty>
```

**Output**:
- Success: `Task {id} updated.`
- Error (invalid ID format): `Please enter a valid number.`
- Error (ID not found): `Task with ID {id} not found.`
- Error (new title too long): `Title must be 200 characters or less.`
- Error (new description too long): `Description must be 1000 characters or less.`

---

### 4. Delete Task

**Input Flow**:
```
Enter your choice: 4
Enter task ID to delete: <user input>
Delete task {id} '{title}'? (y/n): <user input>
```

**Output**:
- Success (confirmed): `Task {id} deleted.`
- Cancelled: `Deletion cancelled.`
- Error (invalid ID format): `Please enter a valid number.`
- Error (ID not found): `Task with ID {id} not found.`

---

### 5. Toggle Complete/Incomplete

**Input Flow**:
```
Enter your choice: 5
Enter task ID to toggle: <user input>
```

**Output**:
- Success (now complete): `Task {id} marked as complete.`
- Success (now incomplete): `Task {id} marked as incomplete.`
- Error (invalid ID format): `Please enter a valid number.`
- Error (ID not found): `Task with ID {id} not found.`

---

### 0. Exit

**Input Flow**:
```
Enter your choice: 0
```

**Output**:
```
Goodbye!
```

Application terminates.

---

### Invalid Menu Choice

**Input Flow**:
```
Enter your choice: <invalid input>
```

**Output**:
```
Invalid choice. Please enter a number from the menu.
```

Menu redisplays.

## Error Message Catalog

| Code | Message | Trigger |
|------|---------|---------|
| E001 | "Title is required." | Empty/whitespace-only title on add |
| E002 | "Title must be 200 characters or less." | Title exceeds 200 chars |
| E003 | "Description must be 1000 characters or less." | Description exceeds 1000 chars |
| E004 | "Please enter a valid number." | Non-integer input for ID |
| E005 | "Task with ID {id} not found." | Operation on non-existent ID |
| E006 | "Invalid choice. Please enter a number from the menu." | Invalid menu selection |

## Confirmation Messages

| Code | Message | Trigger |
|------|---------|---------|
| C001 | "Task {id} added: {title}" | Successful task creation |
| C002 | "Task {id} updated." | Successful task update |
| C003 | "Task {id} deleted." | Successful task deletion |
| C004 | "Deletion cancelled." | User declined deletion |
| C005 | "Task {id} marked as complete." | Toggle incomplete → complete |
| C006 | "Task {id} marked as incomplete." | Toggle complete → incomplete |
| C007 | "Goodbye!" | Application exit |

## Service Layer Interface

For internal use by CLI handlers:

```python
class TaskService:
    """Business logic interface for task operations."""

    def add_task(self, title: str, description: str = "") -> Task:
        """Add a new task. Raises ValueError if validation fails."""

    def get_all_tasks(self) -> list[Task]:
        """Get all tasks."""

    def get_task(self, task_id: int) -> Task | None:
        """Get a task by ID. Returns None if not found."""

    def update_task(self, task_id: int, title: str | None = None,
                    description: str | None = None) -> Task | None:
        """Update a task. Returns None if not found. Raises ValueError if validation fails."""

    def delete_task(self, task_id: int) -> bool:
        """Delete a task. Returns True if deleted, False if not found."""

    def toggle_task(self, task_id: int) -> Task | None:
        """Toggle task completion. Returns updated task or None if not found."""
```
