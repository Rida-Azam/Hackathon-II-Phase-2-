# Research: Phase I Console Todo Application

**Feature**: 001-console-todo-app
**Date**: 2025-12-30
**Status**: Complete

## Overview

This document captures research findings for implementing a Phase I in-memory console Todo application using pure Python 3.13+ standard library.

## Research Topics

### R-001: Python Dataclass for Task Model

**Question**: Best approach for representing Task entities with Python standard library?

**Decision**: Use `@dataclass` decorator from `dataclasses` module

**Rationale**:
- Available in Python 3.7+ (well within 3.13+ requirement)
- Automatic generation of `__init__`, `__repr__`, `__eq__`
- Built-in type hints support
- Optional immutability with `frozen=True`
- Field defaults support for `description=""` and `completed=False`

**Alternatives Considered**:
| Alternative | Pros | Cons | Verdict |
|-------------|------|------|---------|
| Plain dict | Flexible, no imports | No type safety, no IDE support | Rejected |
| NamedTuple | Immutable, hashable | Can't update fields easily | Rejected |
| Regular class | Full control | Boilerplate for `__init__`, `__repr__` | Rejected |
| TypedDict | Type hints for dicts | Still a dict, less ergonomic | Rejected |

**Implementation Notes**:
```python
from dataclasses import dataclass, field

@dataclass
class Task:
    id: int
    title: str
    description: str = ""
    completed: bool = False
```

---

### R-002: In-Memory Storage Pattern

**Question**: How to structure in-memory storage for tasks?

**Decision**: Dedicated `MemoryStore` class with list storage and ID counter

**Rationale**:
- Encapsulation of storage concerns
- Clear interface for CRUD operations
- Easy to test with dependency injection
- Class-level counter for ID generation (never reused)

**Alternatives Considered**:
| Alternative | Pros | Cons | Verdict |
|-------------|------|------|---------|
| Global list | Simple | Poor testability, no encapsulation | Rejected |
| Module-level dict | O(1) lookup | Overkill for expected scale | Rejected |
| Singleton pattern | Single instance guaranteed | More complex, not needed | Rejected |

**Implementation Notes**:
```python
class MemoryStore:
    _next_id: int = 1

    def __init__(self):
        self._tasks: list[Task] = []

    def add(self, title: str, description: str = "") -> Task:
        task = Task(id=MemoryStore._next_id, title=title, description=description)
        MemoryStore._next_id += 1
        self._tasks.append(task)
        return task
```

---

### R-003: CLI Input Handling Best Practices

**Question**: How to handle user input safely and gracefully?

**Decision**: Use `input()` with try/except for type conversion, centralized validators

**Rationale**:
- `input()` is the standard library approach
- try/except catches ValueError for int conversion
- Centralized validators ensure consistent error messages
- Strip whitespace before validation

**Key Patterns**:
```python
def get_int_input(prompt: str) -> int | None:
    """Returns int or None if invalid."""
    try:
        return int(input(prompt).strip())
    except ValueError:
        return None

def validate_title(title: str) -> tuple[bool, str]:
    """Returns (is_valid, error_message)."""
    title = title.strip()
    if not title:
        return False, "Title is required."
    if len(title) > 200:
        return False, "Title must be 200 characters or less."
    return True, ""
```

---

### R-004: Menu Loop Pattern

**Question**: Best pattern for implementing a menu-driven CLI?

**Decision**: While-True loop with dictionary dispatch

**Rationale**:
- Clear, readable structure
- Easy to add/remove menu options
- Handler functions keep menu code clean
- Single exit point via break or return

**Implementation Notes**:
```python
MENU_OPTIONS = {
    "1": ("Add Task", handle_add),
    "2": ("View Tasks", handle_view),
    "3": ("Update Task", handle_update),
    "4": ("Delete Task", handle_delete),
    "5": ("Toggle Complete", handle_toggle),
    "0": ("Exit", None),
}

def run_menu():
    while True:
        display_menu()
        choice = input("Enter choice: ").strip()
        if choice == "0":
            print("Goodbye!")
            break
        if choice in MENU_OPTIONS:
            _, handler = MENU_OPTIONS[choice]
            handler()
        else:
            print("Invalid choice. Please enter a number from the menu.")
```

---

### R-005: Testing with Standard Library

**Question**: How to test without external testing frameworks?

**Decision**: Use `unittest` module (standard library)

**Rationale**:
- Part of Python standard library since Python 2.1
- Full-featured: assertions, test discovery, fixtures
- Compatible with IDE test runners
- No external dependencies

**Implementation Notes**:
```python
import unittest
from src.models.task import Task

class TestTask(unittest.TestCase):
    def test_task_creation(self):
        task = Task(id=1, title="Test")
        self.assertEqual(task.id, 1)
        self.assertEqual(task.title, "Test")
        self.assertEqual(task.description, "")
        self.assertFalse(task.completed)

if __name__ == "__main__":
    unittest.main()
```

---

## Research Summary

| Topic | Decision | Confidence |
|-------|----------|------------|
| Task Model | Python dataclass | High |
| Storage | MemoryStore class with list | High |
| ID Generation | Class-level counter | High |
| Input Handling | input() + validators | High |
| Menu Pattern | While-True + dict dispatch | High |
| Testing | unittest module | High |

## Unresolved Questions

None. All technical decisions are clear and align with Constitution constraints.

## Dependencies

None required. All features implemented with Python 3.13+ standard library:
- `dataclasses` - Task model
- `typing` - Type hints (optional but recommended)
- `unittest` - Testing

## Next Steps

1. Proceed to Phase 1: Generate data-model.md
2. Generate quickstart.md
3. Update agent context
