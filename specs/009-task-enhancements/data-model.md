# Data Model: Task Enhancements

**Feature**: 009-task-enhancements
**Date**: 2026-01-06
**Status**: Phase 1 - Data Model Design

## Overview

This document defines the data model extensions required to support priority, category, and due date fields for tasks. All changes are backward-compatible and use defaults to ensure existing tasks continue functioning.

---

## Entity: Task (Extended)

### Current Schema
```python
# Location: backend/src/models/task.py
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Extended Schema (NEW)
```python
# Location: backend/src/models/task.py
from datetime import datetime, date
from typing import Optional, Literal
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

    # NEW FIELDS
    priority: Literal['low', 'medium', 'high'] = Field(default='medium')
    category: Literal['Home', 'Work', 'Other'] = Field(default='Other')
    due_date: Optional[date] = Field(default=None)

    # Timestamps (unchanged)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## Field Specifications

### Field: priority
- **Type**: String literal ('low' | 'medium' | 'high')
- **Default**: 'medium'
- **Nullable**: No
- **Indexed**: No (small cardinality, filtering done client-side)
- **Validation**: Must be one of the three allowed values
- **UI Representation**: Dropdown selector with visual indicators (colors/icons)
- **Sorting Priority**: high > medium > low (for display ordering)

**Rationale**: String enum provides clear, human-readable values and simplifies frontend rendering without integer-to-label mapping.

---

### Field: category
- **Type**: String literal ('Home' | 'Work' | 'Other')
- **Default**: 'Other'
- **Nullable**: No
- **Indexed**: No (small cardinality, filtering done client-side)
- **Validation**: Must be one of the three allowed values
- **UI Representation**: Dropdown selector with category badges/tags
- **Display**: Show as colored badge next to task title

**Rationale**: Fixed categories keep Phase II simple. User-defined categories would require additional tables and complexity (out of scope).

---

### Field: due_date
- **Type**: Python `date` (not `datetime`) - stores date only, no time component
- **Default**: None (null)
- **Nullable**: Yes
- **Indexed**: No (client-side filtering; add index later if server-side filtering needed)
- **Storage Format**:
  - PostgreSQL: DATE column
  - SQLite: TEXT column in ISO format (YYYY-MM-DD)
- **API Format**: ISO 8601 date string ('2026-01-15')
- **Validation**:
  - Must be valid date if provided
  - No restrictions on past dates (users can track overdue tasks)
- **UI Representation**: HTML5 date picker (`<input type="date">`)

**Rationale**: Date-only storage prevents timezone complexity. Overdue tasks are still useful for historical tracking.

---

## Database Migration Strategy

### Approach: Auto-Migration with Defaults

**Current Behavior**:
- `backend/src/core/db.py` calls `SQLModel.metadata.create_all(engine)` on startup
- SQLModel generates CREATE TABLE statements for new tables
- For existing tables, SQLModel does NOT auto-alter (limitation)

**Migration Path**:

#### Development (SQLite):
1. Update `Task` model in `backend/src/models/task.py`
2. Delete `todo.db` file (dev only - fresh start)
3. Restart backend - new schema created automatically

#### Production (Neon PostgreSQL):
**Option 1: Manual ALTER TABLE** (Recommended for existing data)
```sql
ALTER TABLE tasks
ADD COLUMN priority VARCHAR(10) DEFAULT 'medium',
ADD COLUMN category VARCHAR(10) DEFAULT 'Other',
ADD COLUMN due_date DATE DEFAULT NULL;

-- Add check constraints for validation
ALTER TABLE tasks
ADD CONSTRAINT check_priority CHECK (priority IN ('low', 'medium', 'high'));

ALTER TABLE tasks
ADD CONSTRAINT check_category CHECK (category IN ('Home', 'Work', 'Other'));
```

**Option 2: Recreate Database** (If no production data exists yet)
- Drop and recreate tasks table
- SQLModel will generate correct schema

**Backward Compatibility**: All new fields have defaults, so existing insert/update operations continue working without modification.

---

## Frontend Type Definition

### Current TypeScript Interface
```typescript
// Location: frontend/src/types/todo.ts
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

### Extended TypeScript Interface (NEW)
```typescript
// Location: frontend/src/types/todo.ts
export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Home' | 'Work' | 'Other';

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;

  // NEW FIELDS
  priority: Priority;
  category: Category;
  due_date: string | null; // ISO date string (YYYY-MM-DD) or null

  // Timestamps
  created_at: string;
  updated_at: string;
}
```

**Note**: TypeScript date handling:
- Backend sends: `"2026-01-15"` (ISO date string)
- Frontend receives: string (not Date object)
- HTML date input: works directly with YYYY-MM-DD strings
- Display formatting: Use `new Date(due_date).toLocaleDateString()` when needed

---

## Data Validation Rules

### Backend Validation (Pydantic via SQLModel)
```python
from pydantic import validator

class Task(SQLModel, table=True):
    # ... fields as defined above ...

    @validator('priority')
    def validate_priority(cls, v):
        allowed = ['low', 'medium', 'high']
        if v not in allowed:
            raise ValueError(f'Priority must be one of {allowed}')
        return v

    @validator('category')
    def validate_category(cls, v):
        allowed = ['Home', 'Work', 'Other']
        if v not in allowed:
            raise ValueError(f'Category must be one of {allowed}')
        return v

    @validator('due_date', pre=True)
    def validate_due_date(cls, v):
        if v == "":  # Empty string from form inputs
            return None
        return v  # Pydantic handles date parsing automatically
```

**Note**: Literal types provide built-in validation, so explicit validators may be redundant but add clarity.

---

## Query Patterns

### Fetch All User Tasks (Existing - No Change)
```python
# Location: backend/src/api/routes/todos.py
from sqlmodel import select

statement = select(Task).where(Task.user_id == current_user)
results = session.exec(statement).all()
```
**Returns**: All tasks with new fields included automatically.

### Filter by Priority (Client-Side Recommended)
```typescript
// Frontend filtering
const highPriorityTasks = todos.filter(task => task.priority === 'high');
```

### Filter by Due Date Range (Client-Side Recommended)
```typescript
// Tasks due in next 7 days
const today = new Date();
const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

const upcomingTasks = todos.filter(task => {
  if (!task.due_date) return false;
  const dueDate = new Date(task.due_date);
  return dueDate >= today && dueDate <= sevenDaysLater;
});
```

### Reminder Tasks Logic
```typescript
const reminderTasks = todos.filter(task => {
  if (task.completed) return false;

  if (task.priority === 'high') return true;

  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= sevenDaysLater;
  }

  return false;
});
```

---

## Index Strategy

### Current Indexes
- `user_id` (existing) - for efficient user task filtering

### New Indexes (Future Optimization)
**Not needed initially** (client-side filtering), but consider adding if moving to server-side filtering:

```sql
-- Only add if query performance degrades with large datasets
CREATE INDEX idx_tasks_priority ON tasks(user_id, priority);
CREATE INDEX idx_tasks_category ON tasks(user_id, category);
CREATE INDEX idx_tasks_due_date ON tasks(user_id, due_date);
```

**Current Decision**: No new indexes for Phase II (premature optimization).

---

## Sample Data

### Example Task Records

**Task 1: High Priority, Work Category, Due Soon**
```json
{
  "id": 1,
  "user_id": "user@example.com",
  "title": "Prepare presentation for client meeting",
  "description": "Create slides covering Q1 results and Q2 projections",
  "completed": false,
  "priority": "high",
  "category": "Work",
  "due_date": "2026-01-10",
  "created_at": "2026-01-06T10:00:00Z",
  "updated_at": "2026-01-06T10:00:00Z"
}
```

**Task 2: Medium Priority, Home Category, No Due Date**
```json
{
  "id": 2,
  "user_id": "user@example.com",
  "title": "Buy groceries",
  "description": null,
  "completed": false,
  "priority": "medium",
  "category": "Home",
  "due_date": null,
  "created_at": "2026-01-06T11:30:00Z",
  "updated_at": "2026-01-06T11:30:00Z"
}
```

**Task 3: Low Priority, Other Category, Far Future**
```json
{
  "id": 3,
  "user_id": "user@example.com",
  "title": "Research vacation destinations",
  "description": "Look into beach resorts in Southeast Asia",
  "completed": false,
  "priority": "low",
  "category": "Other",
  "due_date": "2026-03-15",
  "created_at": "2026-01-06T14:00:00Z",
  "updated_at": "2026-01-06T14:00:00Z"
}
```

---

## Data Integrity Constraints

1. **User Isolation**: Tasks MUST be filtered by `user_id` (existing constraint - no change)
2. **Priority Values**: MUST be one of ['low', 'medium', 'high']
3. **Category Values**: MUST be one of ['Home', 'Work', 'Other']
4. **Due Date Format**: MUST be valid ISO date (YYYY-MM-DD) or null
5. **Title Length**: 1-200 characters (existing constraint)
6. **Description Length**: 0-1000 characters (existing constraint)

---

## Backward Compatibility Testing

### Test Scenarios

1. **Existing tasks without new fields**:
   - GET `/api/todos/` should return: priority='medium', category='Other', due_date=null
   - Tasks remain functional without frontend changes

2. **Create task without new fields**:
   - POST `/api/todos/` with only `{"title": "Test"}` should succeed
   - Response includes defaults: priority='medium', category='Other', due_date=null

3. **Update task without touching new fields**:
   - PUT `/api/todos/{id}` with `{"title": "Updated"}` should preserve existing priority/category/due_date

4. **Frontend backward compatibility**:
   - Existing TodoItem component works with or without new fields
   - Add `|| 'medium'` fallbacks in UI if needed: `task.priority || 'medium'`

---

## Next Steps

1. ✅ Data model defined with backward-compatible defaults
2. → Create API contracts (contracts/ directory)
3. → Create quickstart.md with implementation steps
4. → Generate tasks.md with specific, testable implementation tasks
