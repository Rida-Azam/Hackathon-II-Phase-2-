# API Contract: Task Management (Extended)

**Feature**: 009-task-enhancements
**Service**: Todo Backend API
**Base URL**: `/api/todos`
**Authentication**: JWT Bearer token (required for all endpoints)

---

## Common Elements

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

**Note**: JWT token must be present in either:
- HTTP Authorization header (preferred)
- Cookie: `auth_token`

Missing or invalid tokens return `401 Unauthorized`.

### Common Error Responses

```json
// 401 Unauthorized
{
  "detail": "Not authenticated"
}

// 404 Not Found
{
  "detail": "Todo not found"
}

// 422 Validation Error
{
  "detail": [
    {
      "loc": ["body", "priority"],
      "msg": "value is not a valid enumeration member; permitted: 'low', 'medium', 'high'",
      "type": "type_error.enum"
    }
  ]
}
```

---

## Data Types

### Task Object (Extended)

```typescript
interface Task {
  id: number;                          // Auto-generated, read-only
  user_id: string;                     // Auto-set from JWT, read-only
  title: string;                       // Required, 1-200 chars
  description: string | null;          // Optional, max 1000 chars
  completed: boolean;                  // Default: false
  priority: 'low' | 'medium' | 'high'; // Default: 'medium'
  category: 'Home' | 'Work' | 'Other'; // Default: 'Other'
  due_date: string | null;             // ISO date (YYYY-MM-DD) or null
  created_at: string;                  // ISO datetime, auto-generated
  updated_at: string;                  // ISO datetime, auto-updated
}
```

---

## Endpoints

### 1. Create Task

**Endpoint**: `POST /api/todos/`
**Description**: Create a new task for the authenticated user.

#### Request

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body** (all fields except `title` are optional):
```json
{
  "title": "Prepare presentation",
  "description": "Create slides for client meeting",
  "priority": "high",
  "category": "Work",
  "due_date": "2026-01-15"
}
```

**Minimal Request**:
```json
{
  "title": "Buy groceries"
}
```
Defaults: `completed=false`, `priority='medium'`, `category='Other'`, `due_date=null`

#### Response

**Status**: `201 Created`

**Body**:
```json
{
  "id": 1,
  "user_id": "user@example.com",
  "title": "Prepare presentation",
  "description": "Create slides for client meeting",
  "completed": false,
  "priority": "high",
  "category": "Work",
  "due_date": "2026-01-15",
  "created_at": "2026-01-06T10:30:00.123456Z",
  "updated_at": "2026-01-06T10:30:00.123456Z"
}
```

#### Validation Rules

- `title`: Required, string, 1-200 characters
- `description`: Optional, string, max 1000 characters, null allowed
- `priority`: Optional, must be 'low', 'medium', or 'high'
- `category`: Optional, must be 'Home', 'Work', or 'Other'
- `due_date`: Optional, must be valid ISO date (YYYY-MM-DD) or null
  - Accepted formats: `"2026-01-15"`, `null`, omitted, `""`
  - Empty string `""` converts to `null`

#### Error Responses

**422 Validation Error** - Invalid priority:
```json
{
  "detail": [
    {
      "loc": ["body", "priority"],
      "msg": "value is not a valid enumeration member; permitted: 'low', 'medium', 'high'",
      "type": "type_error.enum"
    }
  ]
}
```

**422 Validation Error** - Invalid date format:
```json
{
  "detail": [
    {
      "loc": ["body", "due_date"],
      "msg": "invalid date format",
      "type": "type_error.date"
    }
  ]
}
```

---

### 2. List Tasks

**Endpoint**: `GET /api/todos/`
**Description**: Retrieve all tasks for the authenticated user.

#### Request

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**: None (filtering done client-side)

#### Response

**Status**: `200 OK`

**Body**:
```json
[
  {
    "id": 1,
    "user_id": "user@example.com",
    "title": "Prepare presentation",
    "description": "Create slides for client meeting",
    "completed": false,
    "priority": "high",
    "category": "Work",
    "due_date": "2026-01-15",
    "created_at": "2026-01-06T10:30:00.123456Z",
    "updated_at": "2026-01-06T10:30:00.123456Z"
  },
  {
    "id": 2,
    "user_id": "user@example.com",
    "title": "Buy groceries",
    "description": null,
    "completed": false,
    "priority": "medium",
    "category": "Home",
    "due_date": null,
    "created_at": "2026-01-06T11:00:00.123456Z",
    "updated_at": "2026-01-06T11:00:00.123456Z"
  }
]
```

**Empty List**:
```json
[]
```

#### Notes

- Returns only tasks belonging to the authenticated user
- Includes all fields (new and existing)
- No pagination in Phase II (client handles all tasks)
- Results are unordered (client-side sorting recommended)

---

### 3. Get Single Task

**Endpoint**: `GET /api/todos/{id}`
**Description**: Retrieve a specific task by ID (user must own the task).

#### Request

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Task ID

#### Response

**Status**: `200 OK`

**Body**:
```json
{
  "id": 1,
  "user_id": "user@example.com",
  "title": "Prepare presentation",
  "description": "Create slides for client meeting",
  "completed": false,
  "priority": "high",
  "category": "Work",
  "due_date": "2026-01-15",
  "created_at": "2026-01-06T10:30:00.123456Z",
  "updated_at": "2026-01-06T10:30:00.123456Z"
}
```

#### Error Responses

**404 Not Found**:
```json
{
  "detail": "Todo not found"
}
```
Returned when:
- Task ID doesn't exist
- Task exists but belongs to a different user

---

### 4. Update Task

**Endpoint**: `PUT /api/todos/{id}`
**Description**: Update an existing task (partial updates supported).

#### Request

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Task ID

**Body** (all fields optional - only include fields to update):
```json
{
  "title": "Updated presentation title",
  "priority": "medium",
  "due_date": "2026-01-20"
}
```

**Update Single Field**:
```json
{
  "completed": true
}
```

**Clear Due Date**:
```json
{
  "due_date": null
}
```

#### Response

**Status**: `200 OK`

**Body**: Updated task object
```json
{
  "id": 1,
  "user_id": "user@example.com",
  "title": "Updated presentation title",
  "description": "Create slides for client meeting",
  "completed": false,
  "priority": "medium",
  "category": "Work",
  "due_date": "2026-01-20",
  "created_at": "2026-01-06T10:30:00.123456Z",
  "updated_at": "2026-01-06T14:00:00.123456Z"
}
```

#### Protected Fields

These fields CANNOT be updated (changes ignored):
- `id` - Read-only
- `user_id` - Auto-set from JWT, cannot be changed
- `created_at` - Set on creation, immutable

`updated_at` is automatically set to current timestamp on every update.

#### Validation Rules

Same as Create Task endpoint. Invalid values return `422 Validation Error`.

#### Error Responses

**404 Not Found**: Task doesn't exist or user doesn't own it.
**422 Validation Error**: Invalid field values.

---

### 5. Delete Task

**Endpoint**: `DELETE /api/todos/{id}`
**Description**: Permanently delete a task.

#### Request

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Task ID

#### Response

**Status**: `204 No Content`

**Body**: Empty (no response body)

#### Error Responses

**404 Not Found**: Task doesn't exist or user doesn't own it.

---

### 6. Toggle Task Completion

**Endpoint**: `PATCH /api/todos/{id}/complete`
**Description**: Toggle the `completed` status of a task (true ↔ false).

#### Request

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Task ID

**Body**: Empty (no request body)

#### Response

**Status**: `200 OK`

**Body**: Updated task object
```json
{
  "id": 1,
  "user_id": "user@example.com",
  "title": "Prepare presentation",
  "description": "Create slides for client meeting",
  "completed": true,
  "priority": "high",
  "category": "Work",
  "due_date": "2026-01-15",
  "created_at": "2026-01-06T10:30:00.123456Z",
  "updated_at": "2026-01-06T14:30:00.123456Z"
}
```

#### Behavior

- If `completed=false`, sets to `true`
- If `completed=true`, sets to `false`
- Updates `updated_at` timestamp
- All other fields remain unchanged

#### Error Responses

**404 Not Found**: Task doesn't exist or user doesn't own it.

---

## Backward Compatibility

### Existing Clients Without New Fields

**Scenario 1**: POST request without new fields
```json
POST /api/todos/
{
  "title": "Old client task"
}
```
**Response**: Includes defaults
```json
{
  "id": 5,
  "title": "Old client task",
  "completed": false,
  "priority": "medium",
  "category": "Other",
  "due_date": null,
  ...
}
```

**Scenario 2**: GET request returns new fields
```json
GET /api/todos/
```
Old clients receive tasks with new fields. If client doesn't expect these fields, they are safely ignored by TypeScript/JavaScript.

**Scenario 3**: PUT request without new fields
```json
PUT /api/todos/1
{
  "title": "Updated by old client"
}
```
Existing priority/category/due_date values are preserved (not overwritten).

---

## Implementation Notes

### Backend Changes Required

**File**: `backend/src/models/task.py`
- Add `priority`, `category`, `due_date` fields to Task model

**File**: `backend/src/api/routes/todos.py`
- No changes required - existing routes handle new fields automatically via SQLModel serialization

### Frontend Changes Required

**File**: `frontend/src/types/todo.ts`
- Extend Task interface with new fields

**Files to Update**:
- `frontend/src/components/TodoItem.tsx` - Display priority/category/due_date
- `frontend/src/app/todos/page.tsx` - Add filter/search UI
- (New files for filters, calendar view, reminders)

---

## Testing Checklist

- [ ] Create task with all new fields
- [ ] Create task with minimal fields (title only) - verify defaults
- [ ] Update task priority/category/due_date
- [ ] Clear due_date by setting to null
- [ ] Invalid priority value returns 422
- [ ] Invalid category value returns 422
- [ ] Invalid date format returns 422
- [ ] GET /api/todos/ includes new fields
- [ ] Old tasks (no new fields) return defaults
- [ ] Delete task still works
- [ ] Toggle complete still works
- [ ] User isolation enforced (cannot access other users' tasks)

---

**Contract Version**: 1.0
**Last Updated**: 2026-01-06
**Status**: Ready for implementation
