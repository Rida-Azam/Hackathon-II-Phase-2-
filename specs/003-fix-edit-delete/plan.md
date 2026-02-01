# Implementation Plan: Fix Edit and Delete Todo Functionality

**Branch**: `003-fix-edit-delete` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-fix-edit-delete/spec.md`

## Summary

Fix two critical bugs in the Phase II Todo application where edit and delete operations are non-functional. The root cause is that the `TodoItem` component callbacks (`onUpdate`, `onDelete`, `onToggle`) are passed as empty functions from the parent `/todos/page.tsx`. This plan implements the missing API integration for PUT and DELETE operations, adds proper error handling, loading states, and user confirmation for destructive actions.

**Technical Approach**:
- Implement `handleUpdate`, `handleDelete`, and `handleToggle` functions in the todos page component
- Wire these handlers to the existing `TodoItem` component props
- Add API calls using existing axios client (`/api/todos/{id}` for PUT/DELETE/PATCH)
- Refresh todos list after successful operations
- Add confirmation dialog for delete operations
- Add loading states to prevent double-clicks
- Add console logging for debugging

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 16.1.1), Python 3.13 (FastAPI)
**Primary Dependencies**:
- Frontend: Next.js App Router, React 18, axios, lucide-react icons
- Backend: FastAPI, SQLModel, SQLite (dev), uvicorn
**Storage**: SQLite (local development), tasks table already exists
**Testing**: Manual testing (no automated tests in Phase II)
**Target Platform**: Web browser (Chrome/Firefox/Safari), FastAPI backend on localhost:8000
**Project Type**: Full-stack web application (Next.js frontend + FastAPI backend)
**Performance Goals**:
- Edit operations complete in <3 seconds
- Delete operations complete in <2 seconds
- UI remains responsive during operations
**Constraints**:
- Must not modify database schema
- Must not add new dependencies
- Must maintain Phase II scope (no new features like undo/redo)
- Must use existing axios client and API routes
**Scale/Scope**: Single-user development environment, ~10-50 todos expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase Governance (PASS)
✅ **This is a Phase II bug fix** - No future-phase features
✅ **No architecture changes** - Uses existing REST API structure
✅ **Scope isolated** - Only fixes non-functional edit/delete buttons
✅ **No new UI elements** - Uses existing buttons and forms in TodoItem component

### Technology Constraints (PASS)
✅ **Phase II Tech Stack Compliant**:
- Next.js 16+ App Router ✓
- FastAPI backend ✓
- SQLModel ORM ✓
- Better Auth (already implemented) ✓
- No additional dependencies added ✓

### Agent Behavior Rules (PASS)
✅ **No feature invention** - Only implementing missing handler logic
✅ **Specification-driven** - All changes traced to spec requirements FR-001 through FR-015
✅ **No assumptions** - Clear requirements from user bug report and spec

### Quality Principles (PASS)
✅ **Clean architecture** - Handlers in page component, API calls via axios client
✅ **Error handling** - Try/catch blocks, user-friendly error messages
✅ **Input validation** - Confirm before delete, validate todo.id exists
✅ **Separation of concerns** - UI (TodoItem) separate from logic (page handlers)

**Constitution Gate**: ✅ **PASSED** - Proceeding to Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/003-fix-edit-delete/
├── spec.md              # Feature specification (already created)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technical decisions)
├── data-model.md        # Phase 1 output (entity relationships)
├── quickstart.md        # Phase 1 output (developer guide)
├── contracts/           # Phase 1 output (API contract definitions)
│   └── todos-api.md     # PUT and DELETE endpoint contracts
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist (already created)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created yet)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   └── todos/
│   │       └── page.tsx          # MODIFY: Add handleUpdate, handleDelete, handleToggle
│   ├── components/
│   │   └── TodoItem.tsx          # NO CHANGES: Already has callbacks
│   ├── lib/
│   │   └── api.ts                # NO CHANGES: Axios client already configured
│   └── types/
│       └── todo.ts               # NO CHANGES: Task interface already defined

backend/
└── src/
    ├── api/
    │   └── routes/
    │       └── todos.py          # MODIFY: Add debug logging, validate PUT/DELETE
    ├── models/
    │   └── task.py               # NO CHANGES: Task model already defined
    └── dependencies/
        └── auth.py               # NO CHANGES: Auth already working
```

## Phase 0: Research & Technology Decisions

### Key Technical Decisions

#### Decision 1: API Endpoint Structure
**Decision**: Use existing FastAPI REST endpoints with trailing slashes
**Rationale**:
- Backend already has `/api/todos/` endpoints defined
- PUT `/api/todos/{id}/` updates a todo
- DELETE `/api/todos/{id}/` removes a todo
- PATCH `/api/todos/{id}/complete/` toggles completion status
- Trailing slash required (FastAPI redirects 307 otherwise)
**Alternatives Considered**:
- Create new endpoints → Rejected (violates Phase II scope)
- Use GraphQL mutations → Rejected (not in Phase II tech stack)

#### Decision 2: Confirmation Pattern for Delete
**Decision**: Use browser native `window.confirm()` dialog
**Rationale**:
- No new dependencies required
- Familiar UX pattern
- Blocks execution until user responds
- Simple to implement and test
**Alternatives Considered**:
- Custom modal component → Rejected (would be a new feature)
- Toast notifications → Rejected (not in Phase II spec)
- Slide-to-delete gesture → Rejected (mobile-only pattern)

#### Decision 3: Loading State Management
**Decision**: Local component state with button disable
**Rationale**:
- Prevents double-clicks during async operations
- Simple boolean flag (`isProcessing`)
- No global state management needed
- Matches existing pattern in handleAddTodo
**Alternatives Considered**:
- Global loading context → Rejected (over-engineering)
- Optimistic updates → Rejected (spec requires server confirmation)
- Request debouncing → Rejected (confirmation dialog already prevents rapid clicks)

#### Decision 4: Error Handling Strategy
**Decision**: Try/catch with `setError()` state and error banner display
**Rationale**:
- Matches existing pattern in fetchTodos
- Error banner already implemented in todos page
- Clear user feedback without interrupting workflow
- Console logging for developer debugging
**Alternatives Considered**:
- Silent failures → Rejected (poor UX)
- Alert() dialogs → Rejected (intrusive, blocks UI)
- Retry logic → Rejected (not in Phase II requirements)

#### Decision 5: List Refresh Strategy
**Decision**: Call `fetchTodos()` after successful operations
**Rationale**:
- Ensures data consistency with server
- Reuses existing fetch logic
- Handles edge cases (concurrent modifications)
- Simple and reliable
**Alternatives Considered**:
- Local state mutation → Rejected (can desync from server)
- WebSocket updates → Rejected (not in Phase II)
- Polling → Rejected (inefficient for this use case)

### Best Practices Applied

**React/Next.js**:
- Use async/await for API calls
- Proper error boundaries (try/catch)
- Component state management with useState
- Callback props for child-to-parent communication

**FastAPI/Backend**:
- HTTP status codes (200 OK for PUT, 204 No Content for DELETE)
- Request validation with Pydantic models
- User authorization via existing `get_current_user` dependency
- Debug logging with print() statements (development only)

**REST API**:
- Idempotent PUT requests
- Safe DELETE with confirmation
- Proper HTTP verbs (PUT for full updates, PATCH for partial, DELETE for removal)
- Include trailing slashes in URLs (FastAPI convention)

## Phase 1: Design & Contracts

### Data Model

**Existing Entity** (no changes required):

```typescript
// frontend/src/types/todo.ts
interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

**State Extensions** (temporary UI state):

```typescript
// In /todos/page.tsx
const [isProcessing, setIsProcessing] = useState(false);  // Prevents double-clicks
```

### API Contracts

#### PUT /api/todos/{id}/ - Update Todo

**Request**:
```http
PUT /api/todos/{id}/ HTTP/1.1
Host: localhost:8000
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": false
}
```

**Response** (200 OK):
```json
{
  "id": 123,
  "title": "Updated title",
  "description": "Updated description",
  "completed": false,
  "user_id": "demo-user",
  "created_at": "2026-01-02T10:00:00Z",
  "updated_at": "2026-01-02T10:05:00Z"
}
```

**Error** (401 Unauthorized):
```json
{
  "detail": "Could not validate credentials"
}
```

**Error** (404 Not Found):
```json
{
  "detail": "Todo not found"
}
```

#### DELETE /api/todos/{id}/ - Delete Todo

**Request**:
```http
DELETE /api/todos/{id}/ HTTP/1.1
Host: localhost:8000
Authorization: Bearer {token}
```

**Response** (204 No Content):
```
(empty body)
```

**Error** (401 Unauthorized):
```json
{
  "detail": "Could not validate credentials"
}
```

**Error** (404 Not Found):
```json
{
  "detail": "Todo not found"
}
```

#### PATCH /api/todos/{id}/complete/ - Toggle Completion

**Request**:
```http
PATCH /api/todos/{id}/complete/ HTTP/1.1
Host: localhost:8000
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "id": 123,
  "title": "Task title",
  "description": "Task description",
  "completed": true,  // Toggled
  "user_id": "demo-user",
  "created_at": "2026-01-02T10:00:00Z",
  "updated_at": "2026-01-02T10:06:00Z"
}
```

### Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         TodosPage                               │
│                    (src/app/todos/page.tsx)                     │
│                                                                 │
│  State:                                                         │
│  - todos: Task[]                                                │
│  - isProcessing: boolean                                        │
│  - error: string                                                │
│                                                                 │
│  Handlers:                                                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ handleUpdate(id, title, desc) {                         │  │
│  │   setIsProcessing(true)                                 │  │
│  │   PUT /api/todos/{id}/ with {title, desc}              │  │
│  │   if success: fetchTodos()                              │  │
│  │   if error: setError(message)                           │  │
│  │   setIsProcessing(false)                                │  │
│  │ }                                                        │  │
│  │                                                          │  │
│  │ handleDelete(id) {                                      │  │
│  │   if (!window.confirm("Delete?")) return               │  │
│  │   setIsProcessing(true)                                 │  │
│  │   DELETE /api/todos/{id}/                               │  │
│  │   if success: fetchTodos()                              │  │
│  │   if error: setError(message)                           │  │
│  │   setIsProcessing(false)                                │  │
│  │ }                                                        │  │
│  │                                                          │  │
│  │ handleToggle(id) {                                      │  │
│  │   setIsProcessing(true)                                 │  │
│  │   PATCH /api/todos/{id}/complete/                       │  │
│  │   if success: fetchTodos()                              │  │
│  │   if error: setError(message)                           │  │
│  │   setIsProcessing(false)                                │  │
│  │ }                                                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                          ↓ Props ↓                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │            <TodoItem                                    │  │
│  │              todo={todo}                                │  │
│  │              onUpdate={handleUpdate}                    │  │
│  │              onDelete={handleDelete}                    │  │
│  │              onToggle={handleToggle}                    │  │
│  │            />                                           │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          ↓ User Clicks ↓
┌─────────────────────────────────────────────────────────────────┐
│                        TodoItem                                 │
│                 (src/components/TodoItem.tsx)                   │
│                                                                 │
│  Edit Button → setIsEditing(true) → Show form                  │
│  Save Button → onUpdate(todo.id, editTitle, editDesc)          │
│  Delete Button → onDelete(todo.id)                             │
│  Checkbox → onToggle(todo.id)                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Validation Points

**PUT /api/todos/{id}/ Endpoint** (`backend/src/api/routes/todos.py`):
- Verify todo exists
- Verify todo belongs to current user
- Update only provided fields (title, description, completed)
- Update `updated_at` timestamp
- Return updated todo object

**DELETE /api/todos/{id}/ Endpoint**:
- Verify todo exists
- Verify todo belongs to current user
- Remove from database
- Return 204 No Content (no body)

**PATCH /api/todos/{id}/complete/ Endpoint**:
- Already implemented (toggle_todo_complete)
- Verify ownership
- Toggle `completed` boolean
- Update `updated_at` timestamp

## Phase 2 Preview: Implementation Tasks

*Note: Detailed tasks will be generated by `/sp.tasks` command. This is a high-level preview only.*

### Frontend Tasks

1. **Implement handleUpdate function** (`src/app/todos/page.tsx`)
   - Accept `id`, `title`, `description` parameters
   - Set loading state
   - Call `api.put(/api/todos/${id}/, {title, description})`
   - Handle success: call `fetchTodos()`
   - Handle error: display error message
   - Clear loading state
   - Add console logging

2. **Implement handleDelete function** (`src/app/todos/page.tsx`)
   - Accept `id` parameter
   - Show confirmation dialog
   - If confirmed, set loading state
   - Call `api.delete(/api/todos/${id}/)`
   - Handle success: call `fetchTodos()`
   - Handle error: display error message
   - Clear loading state
   - Add console logging

3. **Implement handleToggle function** (`src/app/todos/page.tsx`)
   - Accept `id` parameter
   - Set loading state
   - Call `api.patch(/api/todos/${id}/complete/)`
   - Handle success: call `fetchTodos()`
   - Handle error: display error message
   - Clear loading state
   - Add console logging

4. **Wire handlers to TodoItem components** (`src/app/todos/page.tsx`)
   - Replace empty `onUpdate={() => {}}` with `onUpdate={handleUpdate}`
   - Replace empty `onDelete={() => {}}` with `onDelete={handleDelete}`
   - Replace empty `onToggle={() => {}}` with `onToggle={handleToggle}`

### Backend Tasks

5. **Add debug logging to PUT endpoint** (`backend/src/api/routes/todos.py`)
   - Log incoming request data
   - Log user ID and todo ID
   - Log update result

6. **Validate PUT endpoint updates fields correctly** (`backend/src/api/routes/todos.py`)
   - Ensure `title` and `description` are updated
   - Ensure `updated_at` timestamp is set
   - Return complete updated todo object

7. **Add debug logging to DELETE endpoint** (`backend/src/api/routes/todos.py`)
   - Log deletion request
   - Log user ID and todo ID
   - Confirm removal from database

8. **Validate DELETE endpoint returns 204** (`backend/src/api/routes/todos.py`)
   - Ensure correct HTTP status code
   - Ensure no response body
   - Ensure todo is actually deleted from database

### Testing Tasks

9. **Manual test: Edit todo title**
   - Create todo
   - Click edit
   - Change title
   - Save
   - Verify change persists

10. **Manual test: Edit todo description**
    - Create todo with description
    - Click edit
    - Change description
    - Save
    - Verify change persists

11. **Manual test: Delete todo with confirmation**
    - Create todo
    - Click delete
    - Confirm dialog
    - Verify todo removed

12. **Manual test: Cancel delete**
    - Create todo
    - Click delete
    - Cancel dialog
    - Verify todo remains

13. **Manual test: Toggle completion**
    - Create todo
    - Click checkbox
    - Verify completed state changes

14. **Test error handling: Network failure**
    - Stop backend
    - Try to edit todo
    - Verify error message appears

15. **Test double-click prevention**
    - Rapidly click save/delete
    - Verify only one request sent

## Success Metrics

Based on spec success criteria (SC-001 through SC-007):

- **SC-001**: Edit operations complete in <3 seconds ✓
- **SC-002**: Delete operations complete in <2 seconds ✓
- **SC-003**: 100% of edits reaching backend succeed ✓
- **SC-004**: 100% of deletes reaching backend succeed ✓
- **SC-005**: Zero accidental deletions (confirmation required) ✓
- **SC-006**: Graceful error messages on backend failure ✓
- **SC-007**: All operations logged to console ✓

## Risks & Mitigations

### Risk 1: Todo ID not passed correctly
**Impact**: Medium - Operations fail silently
**Probability**: Low
**Mitigation**: Add console.log for todo.id in each handler, validate id is number

### Risk 2: Backend doesn't return updated data
**Impact**: Low - List refresh compensates
**Probability**: Low
**Mitigation**: Always call fetchTodos() after success

### Risk 3: User loses unsaved edits during delete
**Impact**: Medium - Poor UX
**Probability**: Low
**Mitigation**: Confirmation dialog explicitly warns user

### Risk 4: Concurrent edits from multiple tabs
**Impact**: Low - Phase II is single-user
**Probability**: Very Low
**Mitigation**: Accept last-write-wins behavior (document in known limitations)

## Next Steps

1. ✅ Specification complete (`spec.md`)
2. ✅ Implementation plan complete (`plan.md`)
3. ⏳ Run `/sp.tasks` to generate detailed implementation tasks
4. ⏳ Execute tasks in dependency order
5. ⏳ Manual testing against acceptance criteria
6. ⏳ Create PR and merge to main branch

## Appendix: File Change Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `frontend/src/app/todos/page.tsx` | Modify | Add handleUpdate, handleDelete, handleToggle functions; wire to TodoItem |
| `backend/src/api/routes/todos.py` | Modify | Add debug logging to PUT and DELETE endpoints |
| `frontend/src/components/TodoItem.tsx` | No Change | Already has correct callback structure |
| `frontend/src/lib/api.ts` | No Change | Axios client already configured |
| `backend/src/models/task.py` | No Change | Task model already defined |

**Total Files Modified**: 2
**Total Files Created**: 0
**Total Files Deleted**: 0
