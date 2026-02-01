# Quickstart: Phase I Console Todo Application

**Feature**: 001-console-todo-app
**Date**: 2025-12-30

## Prerequisites

- Python 3.13 or higher installed
- UV package manager (for project management)
- Terminal/Command Prompt access

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Todo
```

### 2. Verify Python Version

```bash
python --version
# Expected: Python 3.13.x or higher
```

### 3. Set Up Project with UV

```bash
uv init  # If not already initialized
uv sync  # Install dependencies (none for Phase I)
```

## Running the Application

### Option A: Direct Python Execution

```bash
python -m src.main
```

### Option B: Via UV

```bash
uv run python -m src.main
```

## Usage Guide

### Starting the Application

When you run the application, you'll see:

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

### Adding a Task

1. Enter `1` at the menu
2. Type a task title (required, 1-200 characters)
3. Optionally enter a description (press Enter to skip)
4. See confirmation: "Task 1 added: [your title]"

**Example**:
```
Enter your choice: 1
Enter task title: Buy groceries
Enter task description (press Enter to skip): Milk, bread, eggs
Task 1 added: Buy groceries
```

### Viewing Tasks

1. Enter `2` at the menu
2. See all tasks with their status

**Example**:
```
Enter your choice: 2

=====================================
           YOUR TASKS
=====================================
ID  | Status | Title
----|--------|---------------------------
1   | [ ]    | Buy groceries
2   | [x]    | Call mom
=====================================
```

### Updating a Task

1. Enter `3` at the menu
2. Enter the task ID to update
3. Enter new title (press Enter to keep current)
4. Enter new description (press Enter to keep current)

**Example**:
```
Enter your choice: 3
Enter task ID to update: 1
Enter new title (press Enter to keep current): Buy organic groceries
Enter new description (press Enter to keep current):
Task 1 updated.
```

### Deleting a Task

1. Enter `4` at the menu
2. Enter the task ID to delete
3. Confirm with `y` or cancel with `n`

**Example**:
```
Enter your choice: 4
Enter task ID to delete: 1
Delete task 1 'Buy organic groceries'? (y/n): y
Task 1 deleted.
```

### Toggling Completion

1. Enter `5` at the menu
2. Enter the task ID to toggle

**Example**:
```
Enter your choice: 5
Enter task ID to toggle: 2
Task 2 marked as incomplete.
```

### Exiting

1. Enter `0` at the menu
2. Application displays "Goodbye!" and exits

**Note**: All tasks are lost when the application exits (in-memory only).

## Running Tests

### Using unittest (Standard Library)

```bash
python -m unittest discover -s tests -v
```

### Run Specific Test File

```bash
python -m unittest tests.unit.test_task -v
```

## Project Structure

```
Todo/
├── src/
│   ├── __init__.py
│   ├── main.py              # Entry point
│   ├── models/
│   │   └── task.py          # Task dataclass
│   ├── services/
│   │   └── task_service.py  # Business logic
│   ├── storage/
│   │   └── memory_store.py  # In-memory storage
│   └── cli/
│       ├── menu.py          # Menu display/loop
│       ├── handlers.py      # Action handlers
│       └── validators.py    # Input validation
└── tests/
    ├── unit/
    │   ├── test_task.py
    │   ├── test_task_service.py
    │   └── test_validators.py
    └── integration/
        └── test_cli_flow.py
```

## Troubleshooting

### "Python not found"

Ensure Python 3.13+ is installed and in your PATH:
```bash
python3 --version  # Try python3 on macOS/Linux
```

### "Module not found"

Run from the repository root directory:
```bash
cd Todo
python -m src.main
```

### "Invalid choice" errors

Enter only the number corresponding to your choice (1-5 or 0).

## Limitations (Phase I)

- **No persistence**: Tasks are lost when you exit
- **Single user**: No authentication or user accounts
- **No external libraries**: Pure Python standard library
- **Basic features only**: No priorities, tags, due dates, search, or sorting

These limitations are intentional per Phase I specification. Future phases will address them.
