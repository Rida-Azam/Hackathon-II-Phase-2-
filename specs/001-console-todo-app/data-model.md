# Data Model: Phase I Console Todo Application

**Feature**: 001-console-todo-app
**Date**: 2025-12-30
**Source**: [spec.md](./spec.md) Key Entities section

## Entities

### Task

The primary (and only) entity in Phase I. Represents a todo item.

#### Fields

| Field | Type | Required | Constraints | Default | Description |
|-------|------|----------|-------------|---------|-------------|
| `id` | int | Yes | Positive integer, auto-incrementing, unique, never reused | N/A (auto-assigned) | Unique identifier for the task |
| `title` | str | Yes | 1-200 characters after strip() | N/A (required) | Short description of the task |
| `description` | str | No | 0-1000 characters after strip() | `""` (empty string) | Detailed description of the task |
| `completed` | bool | Yes | True or False | `False` | Whether the task is completed |

#### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `title` | Must not be empty after strip() | "Title is required." |
| `title` | Length must be <= 200 characters | "Title must be 200 characters or less." |
| `description` | Length must be <= 1000 characters | "Description must be 1000 characters or less." |
| `id` | Must be positive integer | "Please enter a valid number." |
| `id` | Must exist in storage for operations | "Task with ID [x] not found." |

#### State Transitions

```
                    ┌─────────────┐
                    │   Created   │
                    │ (completed  │
                    │  = False)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │ Updated │  │ Toggled │  │ Deleted │
        │ (title/ │  │ complete│  │ (removed│
        │  desc)  │  │ status  │  │  from   │
        └────┬────┘  └────┬────┘  │  store) │
             │            │       └─────────┘
             │            │
             └─────┬──────┘
                   │
                   ▼
             ┌───────────┐
             │  Active   │
             │ (in store)│
             └───────────┘
```

**State Rules**:
- Tasks start in "Created" state with `completed=False`
- `completed` can be toggled between `True` and `False`
- Updates modify `title` and/or `description` only
- Deleted tasks are removed from storage; their ID is never reused
- No soft-delete; deletion is permanent for session

## Implementation Reference

### Python Dataclass Definition

```python
from dataclasses import dataclass

@dataclass
class Task:
    """
    Represents a todo task item.

    Attributes:
        id: Unique identifier (auto-assigned, never reused)
        title: Task title (1-200 characters, required)
        description: Task description (0-1000 characters, optional)
        completed: Completion status (default False)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False
```

### Storage Interface

```python
class MemoryStore:
    """In-memory storage for Task entities."""

    def add(self, title: str, description: str = "") -> Task:
        """Create and store a new task. Returns the created Task."""

    def get(self, task_id: int) -> Task | None:
        """Retrieve a task by ID. Returns None if not found."""

    def get_all(self) -> list[Task]:
        """Retrieve all tasks."""

    def update(self, task_id: int, title: str | None = None,
               description: str | None = None) -> Task | None:
        """Update a task's title and/or description. Returns updated Task or None."""

    def delete(self, task_id: int) -> bool:
        """Delete a task by ID. Returns True if deleted, False if not found."""

    def toggle_complete(self, task_id: int) -> Task | None:
        """Toggle a task's completed status. Returns updated Task or None."""
```

## Relationships

Phase I has a single entity with no relationships. Future phases may introduce:
- User → Task (one-to-many)
- Category → Task (many-to-many)
- Task → Subtask (one-to-many)

These are explicitly **out of scope** for Phase I per Constitution Phase Governance.

## Indexes / Lookups

For Phase I in-memory storage:
- **Primary Key**: `id` (unique, never reused)
- **No secondary indexes** (list scan acceptable for expected scale)

## Data Lifecycle

| Event | Trigger | Effect |
|-------|---------|--------|
| Creation | User adds task | New Task with auto-incremented ID |
| Read | User views tasks | All tasks returned from storage |
| Update | User updates task | Title/description modified in place |
| Toggle | User marks complete/incomplete | `completed` flag flipped |
| Delete | User confirms deletion | Task removed from storage |
| Session End | User exits application | All data lost (in-memory only) |

## Sample Data

```python
# After typical session:
tasks = [
    Task(id=1, title="Buy groceries", description="Milk, bread, eggs", completed=True),
    Task(id=2, title="Call mom", description="", completed=False),
    Task(id=4, title="Review PR", description="Check the authentication changes", completed=False),
    # Note: id=3 was deleted and will never be reused
]
```
