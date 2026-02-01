# Implementation Plan: Phase I Console Todo Application

**Branch**: `001-console-todo-app` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-console-todo-app/spec.md`

## Summary

Build a minimal, single-user, command-line Todo application that runs entirely in memory using pure Python 3.13+ standard library. The application provides 5 core features (Add, View, Update, Delete, Toggle Complete) through a numbered menu interface with comprehensive input validation and user-friendly error messages.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: None (pure standard library only per Constitution)
**Storage**: In-memory list (no persistence)
**Testing**: unittest (standard library) or manual testing
**Target Platform**: Any platform with Python 3.13+ interpreter (Windows, macOS, Linux)
**Project Type**: Single project (CLI application)
**Performance Goals**: Instant response for all operations (single-user, in-memory)
**Constraints**: No external packages, no fildata lost on exit, unlimited tasks during session

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Spec-Driven Development | Plan derived from approved spec.md | PASS |
| II. Agent Behavior Rules | No features beyond spec scope | PASS |
| III. Phase Governance | Phase I only, no future-phase concepts | PASS |
| IV. Technology Constraints | Python 3.13+, stdlib only, in-memory, CLI | PASS |
| V. Quality Principles | Clean architecture, SRP, validation, error messages | PASS |

**Gate Result**: ALL PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-console-todo-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
src/
├── __init__.py          # Package marker
├── main.py              # Application entry point
├── models/
│   ├── __init__.py
│   └── task.py          # Task dataclass/class
├── services/
│   ├── __init__.py
│   └── task_service.py  # Business logic (CRUD operations)
├── storage/
│   ├── __init__.py
│   └── memory_store.py  # In-memory task storage
└── cli/
    ├── __init__.py
    ├── menu.py          # Menu display and navigation
    ├── handlers.py      # Action handlers for each menu option
    └── validators.py    # Input validation utilities

tests/
├── __init__.py
├── unit/
│   ├── __init__.py
│   ├── test_task.py
│   ├── test_task_service.py
│   └── test_validators.py
└── integration/
    ├── __init__.py
    └── test_cli_flow.py
```

**Structure Decision**: Single project structure selected. The application is a standalone CLI tool with clear separation:
- **models/**: Data structures (Task)
- **services/**: Business logic (TaskService)
- **storage/**: Data access layer (MemoryStore)
- **cli/**: User interface layer (Menu, Handlers, Validators)

This follows Constitution Principle V (separation of concerns: UI / business logic / data access).

## Complexity Tracking

> No violations detected. All choices align with Constitution and spec requirements.

| Aspect | Choice | Justification |
|--------|--------|---------------|
| Data Model | Python dataclass | Standard library, simple, immutable by default |
| Storage | List with dict lookup | O(n) acceptable for in-memory single-user |
| ID Generation | Counter class variable | Simple, never-reuse semantics |
| Input Handling | input() + try/except | Standard library, graceful error handling |

## Architecture Decisions

### AD-001: Task Representation

**Decision**: Use Python `dataclass` for Task model

**Rationale**:
- Part of standard library (Python 3.7+)
- Automatic `__init__`, `__repr__`, `__eq__` generation
- Type hints for documentation
- Immutable option available with `frozen=True` (not used - tasks are mutable)

**Alternatives Considered**:
- Plain dict: Less type safety, no validation at construction
- Named tuple: Immutable, harder to update fields
- Regular class: More boilerplate code

### AD-002: Storage Layer

**Decision**: Dedicated MemoryStore class managing a list of tasks

**Rationale**:
- Encapsulates storage concerns
- Single Responsibility Principle
- Easy to mock in tests
- Clear interface for CRUD operations

**Alternatives Considered**:
- Global list variable: Poor encapsulation, harder to test
- Dictionary by ID: More memory but O(1) lookup; overkill for expected scale

### AD-003: ID Generation Strategy

**Decision**: Class-level counter in MemoryStore, never reset or reused

**Rationale**:
- Per spec requirement: "IDs are never reused after deletion"
- Simple implementation with class variable
- Persists across add/delete operations within session

### AD-004: Input Validation Strategy

**Decision**: Centralized validators module with specific functions

**Rationale**:
- Reusable across different CLI handlers
- Easy to test in isolation
- Consistent error messages
- Follows DRY principle

## Module Responsibilities

| Module | Responsibility | Dependencies |
|--------|----------------|--------------|
| `models/task.py` | Task data structure definition | None |
| `storage/memory_store.py` | In-memory CRUD operations, ID generation | models.task |
| `services/task_service.py` | Business logic, validation orchestration | storage, models |
| `cli/validators.py` | Input validation functions | None |
| `cli/menu.py` | Menu display and main loop | cli.handlers |
| `cli/handlers.py` | Individual action implementations | services, validators |
| `main.py` | Application entry point | cli.menu |

## Data Flow

```
User Input → cli/menu.py → cli/handlers.py → services/task_service.py → storage/memory_store.py
                                ↓
                        cli/validators.py
                                ↓
                        Console Output
```

1. User selects menu option
2. Menu dispatches to appropriate handler
3. Handler validates input using validators
4. Handler calls TaskService for business logic
5. TaskService interacts with MemoryStore for data operations
6. Result flows back through handler to user output

## Error Handling Strategy

| Error Type | Handling | User Message |
|------------|----------|--------------|
| Invalid menu choice | Catch in menu loop | "Invalid choice. Please enter a number from the menu." |
| Non-integer ID | ValueError in handler | "Please enter a valid number." |
| Task not found | Return None from service | "Task with ID [x] not found." |
| Empty title | Validation in handler | "Title is required." |
| Title too long | Validation in handler | "Title must be 200 characters or less." |
| Description too long | Validation in handler | "Description must be 1000 characters or less." |

## Testing Strategy

**Unit Tests** (per module):
- `test_task.py`: Task dataclass creation, field validation
- `test_task_service.py`: Service methods (add, get, update, delete, toggle)
- `test_validators.py`: Input validation functions

**Integration Tests**:
- `test_cli_flow.py`: End-to-end menu flows with mock input

**Manual Testing**:
- Run application and exercise all menu options
- Verify error messages for invalid inputs
- Confirm ID never-reuse behavior
