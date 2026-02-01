# Data Model: Phase II Full-Stack Web Todo Application

**Feature**: Full-Stack Web Todo Application
**Date**: 2025-12-31
**Phase**: Phase II

## Entities

### User (Managed by Better Auth)

The User entity is managed by Better Auth and not directly modeled in SQLModel. However, todos reference users via foreign key.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK | Unique identifier (UUID format) |
| email | string | UNIQUE, NOT NULL | User's email address |
| name | string | NULLABLE | User's display name |
| created_at | timestamp | NOT NULL | Account creation timestamp |

**Source**: Better Auth schema (not modified in this phase)

---

### Task (Todo)

The Task entity represents a todo item owned by a user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, AUTOINCREMENT | Unique identifier for the task |
| user_id | string | FK → users.id, NOT NULL | Owner of the task |
| title | string | NOT NULL, MAX 200 | Task title (required) |
| description | text | NULLABLE, MAX 1000 | Task details (optional) |
| completed | boolean | DEFAULT FALSE | Completion status |
| created_at | timestamp | NOT NULL | Creation timestamp |
| updated_at | timestamp | NOT NULL | Last modification timestamp |

---

## Relationships

```
User (1) ───< (N) Task
```

- One User can have many Tasks (one-to-many)
- Each Task belongs to exactly one User
- Enforced via foreign key: `tasks.user_id → users.id`
- Row-level security: All queries filter by `user_id = current_user.id`

---

## Validation Rules

| Rule | Implementation |
|------|----------------|
| Title required | `title: str = Field(..., min_length=1, max_length=200)` |
| Title max 200 | `max_length=200` in SQLModel field |
| Description max 1000 | `max_length=1000` in SQLModel field |
| Description optional | `description: Optional[str] = Field(None, max_length=1000)` |
| Completed default false | `completed: bool = Field(default=False)` |
| User ownership required | `user_id: str = Field(..., foreign_key="users.id")` |

---

## State Transitions

```
┌─────────────┐
│  CREATED    │ (completed=false)
└──────┬──────┘
       │ toggle_complete()
       ▼
┌─────────────┐
│  COMPLETED  │ (completed=true)
└──────┬──────┘
       │ toggle_complete()
       ▼
┌─────────────┐
│  ACTIVE     │ (completed=false)
└─────────────┘
       │ delete()
       ▼
    [DELETED]
```

**Actions**:
- `toggle_complete()`: Inverts the `completed` boolean
- `delete()`: Removes the task from the database

---

## SQLModel Implementation (Backend)

```python
# backend/src/models/task.py
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Session


class Task(SQLModel, table=True):
    """Todo item owned by a user."""

    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        nullable=False
    )
    user_id: str = Field(
        ...,
        foreign_key="users.id",
        nullable=False,
        index=True
    )
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        nullable=False
    )
    description: Optional[str] = Field(
        None,
        max_length=1000
    )
    completed: bool = Field(
        default=False,
        nullable=False
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
```

---

## API Response Models (Pydantic)

```python
# backend/src/api/models.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TaskCreate(BaseModel):
    """Request model for creating a task."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)


class TaskUpdate(BaseModel):
    """Request model for updating a task."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)


class TaskResponse(BaseModel):
    """Response model for task data."""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
```

---

## Database Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| pk_tasks | id | Primary key lookup |
| fk_tasks_user | user_id | Foreign key to users |
| idx_tasks_user_id | user_id | Filter by user ownership |

---

## Migration (Alembic)

**Initial migration creates the tasks table:**

```python
# alembic/versions/001_create_tasks.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])
```
