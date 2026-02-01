# Implementation Plan: Task Priority, Category, Due Dates & Enhanced Filtering

**Branch**: `009-task-enhancements` | **Date**: 2026-01-06 | **Spec**: `specs/009-task-enhancements/spec.md`
**Input**: Feature specification from `/specs/009-task-enhancements/spec.md`

## Summary

Extend the Todo application so authenticated users can assign priority (low/medium/high), category (Home/Work/Other), and optional due dates when creating/editing tasks. Surface these new attributes through reminders, calendar views, and enhanced filtering/search on the /todos page while maintaining Phase II constraints (FastAPI backend, Next.js frontend, REST-only, no realtime jobs).

Primary implementation steps:
1. Extend SQLModel Task schema and API contracts to include new fields with safe defaults.
2. Update frontend forms, task cards, and state to capture/display priority, category, and due dates.
3. Build client-side filtering, reminders section, and calendar page using existing endpoints.
4. Remove "Notes" from sidebar navigation and wire new views.

## Technical Context

**Language/Version**: Backend Python 3.13+, Frontend TypeScript/React (Next.js 16.1)
**Primary Dependencies**: FastAPI, SQLModel, Uvicorn, Next.js App Router, Axios, TailwindCSS, lucide-react
**Storage**: Neon PostgreSQL (prod) / SQLite (dev fallback)
**Testing**: Backend pytest (future), manual API verification, frontend Next.js dev/test, Playwright (if configured)
**Target Platform**: Web application (Next.js frontend + FastAPI backend)
**Project Type**: Full-stack web (frontend + backend directories)
**Performance Goals**: Instant client-side filtering (<100ms), API responses under existing latency (<300ms)
**Constraints**: No new background jobs, no new external dependencies, maintain dark theme, reuse REST endpoints
**Scale/Scope**: Single-user task lists (<5k tasks/user), Phase II feature scope only

## Constitution Check

| Requirement | Pass? | Notes |
|-------------|-------|-------|
| Spec-Driven workflow followed | ✅ | spec → plan flow maintained |
| No manual coding outside approved specs | ✅ | Plan mirrors spec requirements |
| Phase isolation respected | ✅ | Only Phase II tech (Next.js/FastAPI/SQLModel) used |
| No future-phase features | ✅ | No realtime, AI, or background jobs |
| Technology constraints | ✅ | No new deps added |

**Gate Result**: ✅ Proceed to Phase 0 and Phase 1 artifacts.

## Phase 0: Research Highlights
- SQLModel schema can add new columns with defaults; Update Task model and provide DB migration notes.
- Client-side filtering sufficient for current scale; no API query params required.
- Reminder logic: high priority OR due within 7 days (excluding completed tasks).
- Calendar view: custom React grid (no external libs) for monthly display.
- Sidebar nav removal simply edits `Sidebar.tsx` navItems.

(See `research.md` for full details.)

## Phase 1: Design & Contracts

### Data Model Decisions
- Task model extended with `priority`, `category`, `due_date` fields using Literal types and optional date.
- Frontend Task interface mirrors backend fields; due_date represented as ISO string or null.
- Database migration strategy defined for SQLite dev and Neon production.

### API Contracts
- No new endpoints; extend existing CRUD responses and requests with new fields.
- Validation rules documented for priority/category/due_date.
- Backward compatibility guaranteed via defaults.

### Quickstart Implementation Steps
- Step-by-step guide covering backend model changes, frontend form updates, TodoItem display, filters, reminders page, calendar page, testing checklist, and deployment notes.

(Artifacts located in `data-model.md`, `contracts/task-api.md`, `quickstart.md`.)

## Project Structure

### Documentation (this feature)
```text
specs/009-task-enhancements/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── task-api.md
└── tasks.md     # (to be generated via /sp.tasks)
```

### Source Code (repository root)
```text
backend/
├── src/
│   ├── models/
│   │   └── task.py
│   ├── api/
│   │   └── routes/
│   │       └── todos.py
│   ├── dependencies/
│   │   └── auth.py
│   └── core/
│       └── db.py
└── tests/ (future)

frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   └── todos/
│   │       └── page.tsx   # main task dashboard
│   │   ├── reminders/
│   │   │   └── page.tsx   # new
│   │   └── calendar/
│   │       └── page.tsx   # new
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── TodoItem.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   └── types/
│       └── todo.ts
└── public/
```

**Structure Decision**: Web application with separate backend and frontend directories; existing structure already aligned with Phase II architecture. No additional packages introduced.

## Implementation Phases & Tasks

### Phase A: Backend Model & API
1. **Extend Task SQLModel** (`backend/src/models/task.py`)
   - Add imports for `date`, `Literal`
   - Define `priority`, `category`, `due_date` with defaults
   - Ensure validators handle empty strings → None for due_date

2. **DB Migration Notes**
   - Document ALTER TABLE statements (Neon) in README/research
   - For dev SQLite, recreate DB if needed

3. **API Validation**
   - Confirm POST/PUT accept new fields; update tests (future) or manual verification

### Phase B: Frontend Types & Forms
1. **Update `frontend/src/types/todo.ts`**
   - Add Priority/Category types and new fields
2. **`frontend/src/app/todos/page.tsx`**
   - Extend state for new form fields
   - Update add form UI + submission payload
   - Implement filter/search state + derived `filteredTodos`
3. **`frontend/src/components/TodoItem.tsx`**
   - Display badges for priority/category/date
   - Support editing new fields (state + form inputs)
   - Update `onUpdate` signature/usage

### Phase C: Reminders & Calendar Views
1. **Sidebar Update** (`Sidebar.tsx`)
   - Remove Notes entry; ensure nav order correct
2. **Create `/reminders` Page**
   - Reuse fetch logic from /todos
   - Filter tasks by reminder criteria
   - Display with TodoItem component
3. **Create `/calendar` Page**
   - Build custom calendar grid component
   - Show indicators for dates with tasks
   - Allow date selection to filter tasks list

### Phase D: UI Enhancements & Testing
1. **Filter bar styling** on /todos page (search, dropdowns, clear button)
2. **Empty states** for filter results, reminders, calendar
3. **Manual QA**
   - Create tasks with combinations of priority/category/due_date
   - Verify reminder/calendar behavior
   - Responsive layouts (mobile/desktop)

## Dependencies & Risks

### Dependencies
- Existing authentication flow (JWT) must remain functional.
- Backend `/api/todos/` endpoint expected to return new fields (requires backend changes before frontend fetch).
- No third-party calendar or date libraries introduced.

### Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| DB schema migration failure on prod | High | Provide SQL ALTER script; test on staging before deploy |
| Client-side filtering performance with large lists | Medium | Optimize derived arrays (useMemo) if needed; consider server filters later |
| Calendar UX complexity | Medium | Keep grid simple; test month navigation thoroughly |
| Inconsistent due date timezone handling | Low | Store as date only (no timezone), zero out time before comparisons |

## Testing Strategy
- **Backend**: Manual API calls (curl/Postman) verifying new fields; add unit tests for Task model (future tasks).
- **Frontend**: Manual end-to-end verification across /todos, /reminders, /calendar; ensure forms, filters, and displays behave as specified.
- **Cross-Browser**: Test in Chrome + Firefox for date input behavior.

## Complexity Tracking
_No constitution violations; section intentionally left blank._

## Ready for /sp.tasks
All Phase 0 and Phase 1 artifacts completed (research, data-model, contracts, quickstart). Plan validated against constitution and project constraints.
