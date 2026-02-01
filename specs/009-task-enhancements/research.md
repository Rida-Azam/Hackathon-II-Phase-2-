# Research & Technical Clarifications: Task Enhancements

**Feature**: 009-task-enhancements
**Phase**: Phase 0 - Research
**Date**: 2026-01-06

## Overview

This document resolves technical unknowns and clarifies implementation approaches for adding priority, category, due dates, search/filter, reminders, and calendar features to the Todo application.

## Technical Questions & Resolutions

### Q1: Database Schema Migration Strategy

**Question**: How should we handle adding new fields (priority, category, due_date) to the existing tasks table?

**Answer**:
- **Current Setup**: SQLModel with auto-migration via `SQLModel.metadata.create_all(engine)` in `backend/src/core/db.py`
- **Approach**: Extend the Task model in `backend/src/models/task.py` with new fields using proper defaults
- **Migration**: SQLModel will auto-create columns on next startup for new deployments. For existing databases:
  - SQLite (dev): Fields will be added automatically if defaults are provided
  - PostgreSQL (production/Neon): ALTER TABLE statements may be needed for existing data
- **Safety**: All new fields MUST have defaults to avoid breaking existing records

**Resolution**: Use SQLModel field defaults (priority='medium', category='Other', due_date=None) to enable seamless schema evolution.

---

### Q2: Priority Field Implementation

**Question**: Should priority be stored as string enum or integer?

**Answer**:
- **Options Considered**:
  1. String enum: 'low', 'medium', 'high'
  2. Integer: 1 (low), 2 (medium), 3 (high)
  3. Dedicated enum class

- **Decision**: String enum with lowercase values
- **Rationale**:
  - More readable in database and API responses
  - Frontend can directly use values in dropdowns
  - SQLModel supports string literal types for validation
  - No integer-to-string mapping needed

**Implementation**:
```python
from typing import Literal

priority: Literal['low', 'medium', 'high'] = Field(default='medium')
```

---

### Q3: Category Field Strategy

**Question**: Should categories be hardcoded or user-defined?

**Answer**:
- **Phase II Requirement**: Hardcoded categories (Home, Work, Other) as specified in spec
- **Current Phase**: Fixed enum approach
- **Future Consideration**: User-defined categories would require separate categories table (out of scope for Phase II)

**Decision**: Use string literal type with fixed values: 'Home', 'Work', 'Other' (default: 'Other')

---

### Q4: Due Date Storage Format

**Question**: How should due dates be stored and validated?

**Answer**:
- **Backend Storage**: Python `date` type (not `datetime`) - stores YYYY-MM-DD only
- **Database Column**: DATE type (PostgreSQL) or TEXT/ISO format (SQLite)
- **API Format**: ISO 8601 date string ('2026-01-15')
- **Frontend Input**: HTML5 `<input type="date">` returns YYYY-MM-DD format
- **Validation**: Optional field, no past-date restriction (users may track overdue tasks)

**Implementation**:
```python
from datetime import date
due_date: Optional[date] = Field(default=None)
```

---

### Q5: Search & Filter Implementation

**Question**: Should filtering be client-side or server-side?

**Answer**:
- **Current Scale**: Single-user task lists (typically <1000 tasks per user)
- **Decision**: **Client-side filtering** with optional server-side support later
- **Rationale**:
  - Simpler implementation (no API changes needed)
  - Better UX (instant filtering without network latency)
  - Reduces backend complexity
  - Existing `/api/todos/` endpoint fetches all user tasks already

**Implementation Approach**:
- Frontend: JavaScript filter/search logic on `todos` state array
- Search: Case-insensitive substring match on `title` field
- Filters: Exact match on priority/category, date range logic for due_date

**Future Enhancement** (out of scope): Add query parameters to `/api/todos/` for server-side filtering if performance degrades with large datasets.

---

### Q6: Reminder Logic Definition

**Question**: What constitutes a "reminder-worthy" task?

**Answer** (from spec):
- **High-priority tasks** (priority === 'high'), OR
- **Tasks due within next 7 days** (due_date between today and today+7)
- **Completed tasks excluded** from reminders
- **No due date + not high priority** = not in reminders

**Implementation**:
```typescript
const reminderTasks = todos.filter(task =>
  !task.completed && (
    task.priority === 'high' ||
    (task.due_date && isWithinNextSevenDays(task.due_date))
  )
);
```

---

### Q7: Calendar View Complexity

**Question**: Should we build a custom calendar or use a library?

**Answer**:
- **Spec Requirement**: "Simple monthly grid or list" with task indicators
- **Decision**: **Custom simple calendar grid** (no external library)
- **Rationale**:
  - Matches "no new dependencies" Phase II constraint
  - Simple grid is <100 lines of React code
  - Full control over styling (dark theme integration)
  - No library learning curve or bundle size increase

**Implementation Approach**:
- Generate calendar grid using JavaScript Date APIs
- Mark days with tasks using colored dots or count badges
- Click handler filters tasks by selected date
- Show month navigation (prev/next buttons)

---

### Q8: Sidebar Navigation Changes

**Question**: How to handle removing "Notes" from sidebar?

**Answer**:
- **Current Implementation**: `frontend/src/components/Sidebar.tsx` has hardcoded `navItems` array
- **Change Required**: Remove the Notes item from array
- **Impact**: `/notes` route may still exist but won't be accessible from sidebar
- **Cleanup**: Optionally delete `/notes` page component if not used elsewhere

**Action**: Update `navItems` in Sidebar.tsx to exclude Notes entry.

---

### Q9: API Endpoint Changes

**Question**: Do we need new API endpoints or can we extend existing ones?

**Answer**: **No new endpoints required** - extend existing Task model only.

**Changes Needed**:
1. **Backend Model** (`backend/src/models/task.py`):
   - Add `priority`, `category`, `due_date` fields with defaults

2. **API Behavior** (automatic via SQLModel):
   - POST `/api/todos/` - accepts new fields (optional in request body)
   - PUT `/api/todos/{id}` - accepts new fields for updates
   - GET `/api/todos/` - returns new fields in response

3. **Frontend Type** (`frontend/src/types/todo.ts`):
   - Extend `Task` interface with new fields

**No route changes needed** - SQLModel serialization handles new fields automatically.

---

### Q10: Backward Compatibility

**Question**: Will existing frontend code break with new fields?

**Answer**: **No breaking changes** if implemented correctly.

**Safety Measures**:
- All new fields have defaults (backend won't fail on old requests)
- Frontend type is extended (optional fields with `?` modifier)
- Existing task creation/edit forms continue working without new fields
- New UI components (dropdowns, date picker) are additive

**Testing Strategy**: Test with existing tasks (no priority/category/due_date) to ensure graceful handling.

---

## Technical Constraints Summary

✅ **Must Follow**:
- No new external libraries (use React, Tailwind, lucide-react only)
- No database migration scripts (rely on SQLModel auto-migration with defaults)
- No breaking changes to existing API contracts
- Maintain dark theme styling consistency
- Keep multi-user isolation (user_id filtering)

❌ **Out of Scope**:
- Real-time updates or WebSockets
- Background jobs for reminder notifications
- Server-side full-text search
- User-defined categories
- Calendar event sync (Google Calendar, etc.)

---

## Dependencies & Tools

**Backend**:
- Python 3.13+
- FastAPI (existing)
- SQLModel (existing)
- Pydantic for validation (existing via SQLModel)

**Frontend**:
- Next.js 16.1.1 (existing)
- React 19+ (existing)
- TypeScript (existing)
- Tailwind CSS (existing)
- lucide-react icons (existing)

**No New Dependencies Required** ✅

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Schema migration fails on production DB | Medium | High | Use field defaults; test on staging DB first; document manual ALTER TABLE if needed |
| Client-side filtering slow with many tasks | Low | Medium | Profile performance; add server-side filtering later if needed |
| Date format inconsistencies between systems | Low | Low | Use ISO 8601 consistently; validate on backend |
| Sidebar removal breaks navigation | Low | Low | Test all routes after change; update tests |
| Calendar UI performance on mobile | Low | Low | Use CSS grid efficiently; test on devices; lazy render if needed |

---

## Phase 1 Readiness Checklist

- [x] Database schema approach defined (SQLModel with defaults)
- [x] Field types and validation rules clarified (Literal types)
- [x] API contract changes documented (none needed - model extension only)
- [x] Filtering strategy decided (client-side)
- [x] Reminder logic defined (high priority OR due within 7 days)
- [x] Calendar approach decided (custom simple grid)
- [x] No new dependencies required
- [x] Backward compatibility ensured

**Status**: ✅ Ready to proceed to Phase 1 (Data Model & Contracts)

---

## Next Steps

1. **Phase 1**: Create detailed data-model.md with SQLModel code
2. **Phase 1**: Define API contracts for extended Task model
3. **Phase 1**: Create quickstart.md with implementation guide
4. **Phase 2**: Generate tasks.md with testable implementation steps
