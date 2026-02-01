# Data Model: Evolution of Todo - Responsive Black Theme

**Branch**: `006-responsive-black-theme` | **Date**: 2026-01-03 | **Spec**: [./spec.md](./spec.md)

**Note**: This data model has been reverse-engineered from the existing SQLModel implementation in `backend/src/models/task.py`.

## Core Entities

### 1. Task (SQLModel Table)

The primary entity representing a single todo item. It is scoped to a specific user via `user_id`.

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| `id` | `Optional[int]` | Primary Key | Auto-incrementing identifier |
| `user_id` | `str` | Indexed, Not Null | Owner of the task (from Auth token) |
| `title` | `str` | 1–200 chars, Not Null | The task's main text |
| `description` | `Optional[str]` | Max 1000 chars | Additional details |
| `completed` | `bool` | Default: False | Status of the task |
| `created_at` | `datetime` | Default: UTC Now | Task creation timestamp |
| `updated_at` | `datetime` | Default: UTC Now | Last modification timestamp |

## Relationships

- **User → Tasks**: (Implicit) Each task contains a `user_id` string mapping to the authenticated user. In Phase II, this is a string identifier from the login provider or mock token.

## Schema Evolution

As this is Phase II, the schema is managed via **Alembic** migrations.

### SQLite (Local Development)
- `todo.db`: File-based database for rapid prototyping.

### PostgreSQL (Production)
- Neon Serverless PostgreSQL is the target for cloud deployment.
- All SQLModel fields are compatible with PostgreSQL standard types.

## Frontend Representations

The frontend (Next.js) uses a TypeScript interface matching the backend schema:

```typescript
// frontend/src/types/todo.ts
export interface Todo {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```
