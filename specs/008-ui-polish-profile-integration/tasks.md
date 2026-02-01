# Tasks: Phase II UI Polish & Profile Integration

**Input**: Design documents from `/specs/008-ui-polish-profile-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No test tasks included (manual browser testing specified in plan.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with frontend/backend separation:
- **Frontend**: `frontend/src/` (all tasks are frontend only)
- **Backend**: No changes (backend already functional)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create auth utilities and type definitions that all user stories depend on

- [ ] T001 Create TypeScript type definitions for auth in frontend/src/types/auth.ts
- [ ] T002 [P] Create auth utility functions in frontend/src/lib/auth.ts

**What to create**:
- T001: UserProfile interface, NavItem interface, SessionData interface
- T002: getUserFromSession(), isAuthenticated(), logout() functions

**Checkpoint**: After this phase, auth utilities are available for all components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational tasks needed - all user stories can be implemented independently after Phase 1

**⚠️ CRITICAL**: Phase 1 must be complete, but then all user stories (US1, US2, US3, US4) can proceed in parallel

**Checkpoint**: Foundation ready - all user story phases can now begin in parallel

---

## Phase 3: User Story 1 - Navigate Application via Sidebar (Priority: P1) 🎯 MVP

**Goal**: Make all sidebar navigation items functional so users can navigate between different sections (Dashboard, Tasks, Calendar, Reminders, Notes, Settings)

**Independent Test**: Click each sidebar menu item and verify navigation to correct page or placeholder. Dashboard and Tasks go to /todos, Calendar/Reminders/Notes show "Coming soon" placeholders, Settings shows profile page.

### Implementation for User Story 1

- [ ] T003 [P] [US1] Update sidebar navigation hrefs in frontend/src/components/Sidebar.tsx
- [ ] T004 [P] [US1] Create Calendar placeholder page in frontend/src/app/calendar/page.tsx
- [ ] T005 [P] [US1] Create Reminders placeholder page in frontend/src/app/reminders/page.tsx
- [ ] T006 [P] [US1] Create Notes placeholder page in frontend/src/app/notes/page.tsx
- [ ] T007 [US1] Create Settings page with user profile display in frontend/src/app/settings/page.tsx

**What to implement**:
- T003: Update navItems array to use proper hrefs: /todos (dashboard, tasks), /calendar, /reminders, /notes, /settings
- T004-T006: Create placeholder pages with "Coming soon" message, "Back to Dashboard" link, dark theme styling
- T007: Create settings page with Sidebar + Header layout, display user name/email/status from getUserFromSession()

**Acceptance Criteria**:
- ✅ Click Dashboard → Stay on /todos or refresh
- ✅ Click Tasks → Navigate to /todos
- ✅ Click Calendar → Show placeholder with "Coming soon"
- ✅ Click Reminders → Show placeholder with "Coming soon"
- ✅ Click Notes → Show placeholder with "Coming soon"
- ✅ Click Settings → Show settings page with user info
- ✅ All navigation instant (<100ms client-side)
- ✅ No console errors

**Checkpoint**: User Story 1 complete - all navigation functional, independently testable

---

## Phase 4: User Story 2 - Return to Homepage from Logo (Priority: P1)

**Goal**: Make the "Todo" logo in sidebar clickable to navigate to homepage

**Independent Test**: Click "Todo" logo from any page and verify navigation to homepage (/)

### Implementation for User Story 2

- [ ] T008 [US2] Wrap sidebar logo in Link component in frontend/src/components/Sidebar.tsx

**What to implement**:
- T008: Wrap existing logo markup (lines 44-50) with `<Link href="/">` component, maintain existing styling

**Acceptance Criteria**:
- ✅ Click logo from /todos → Navigate to homepage (/)
- ✅ Click logo from settings → Navigate to homepage (/)
- ✅ Click logo from placeholder pages → Navigate to homepage (/)
- ✅ Click logo on homepage → Stay on homepage (no change)
- ✅ Navigation instant (<100ms)

**Checkpoint**: User Story 2 complete - logo navigation functional, independently testable

---

## Phase 5: User Story 3 - View Authenticated User Profile (Priority: P2)

**Goal**: Display user's name from authentication session in sidebar and header profile sections

**Independent Test**: Login and verify profile sections show user name (not hardcoded "Soetly"), avatar icon, "PRO MEMBER" badge, and "ACTIVE NOW" status

### Implementation for User Story 3

- [ ] T009 [P] [US3] Integrate auth utility in Sidebar profile section in frontend/src/components/Sidebar.tsx
- [ ] T010 [P] [US3] Integrate auth utility in Header profile section in frontend/src/components/Header.tsx

**What to implement**:
- T009: Add useState for userName, useEffect to call getUserFromSession(), replace hardcoded "Soetly" (line 84) with userName state
- T010: Add useState for userName, useEffect to call getUserFromSession(), replace hardcoded "Soetly" (line 25) with userName state

**Acceptance Criteria**:
- ✅ Sidebar shows user name (fallback "User" if not available)
- ✅ Header shows user name (fallback "User" if not available)
- ✅ Avatar icon displays (User icon from Lucide)
- ✅ "PRO MEMBER" badge displays in sidebar
- ✅ "ACTIVE NOW" status displays in header
- ✅ Profile data loads within 1 second
- ✅ No layout shift during load

**Checkpoint**: User Story 3 complete - profile integration functional, independently testable

---

## Phase 6: User Story 4 - Sign Out Successfully (Priority: P2)

**Goal**: Verify sign-out functionality properly clears session (both localStorage and cookies) and redirects to login

**Independent Test**: Click sign out button, verify localStorage and cookies cleared, verify redirect to /login, verify cannot access /todos without re-login

### Implementation for User Story 4

- [ ] T011 [US4] Verify and update logout handler in frontend/src/app/todos/page.tsx

**What to implement**:
- T011: Review existing handleLogout function, ensure it clears localStorage.auth_token, clears cookie auth_token, redirects to /login with window.location.href (not router.push)

**Acceptance Criteria**:
- ✅ Click Sign Out → localStorage.auth_token removed
- ✅ Sign Out → Cookie auth_token removed (expires in past)
- ✅ Sign Out → Redirect to /login page
- ✅ After logout, navigate to /todos → Redirect to /login (middleware works)
- ✅ Re-login after logout → Works normally
- ✅ Logout completes within 2 seconds
- ✅ Full page reload ensures all state cleared

**Checkpoint**: User Story 4 complete - logout functional, independently testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, regression testing, and quality checks

- [ ] T012 Verify no console errors or warnings in browser DevTools
- [ ] T013 Verify existing functionality not broken (add task, toggle complete, login, signup)
- [ ] T014 Verify dark theme consistency across all new pages
- [ ] T015 Test mobile responsiveness (hamburger menu, sidebar collapse)
- [ ] T016 Test all navigation flows end-to-end
- [ ] T017 Verify performance goals met (navigation <100ms, profile load <1s)

**What to verify**:
- T012: Open DevTools Console, navigate through all pages, confirm no errors
- T013: Add task, toggle completion, delete task, login, signup - all work
- T014: Check Calendar, Reminders, Notes, Settings pages match dark theme
- T015: Resize browser to mobile, verify hamburger menu, sidebar behavior
- T016: Test full user journeys from spec acceptance scenarios
- T017: Use DevTools Network/Performance tabs to verify speed

**Acceptance Criteria**:
- ✅ No console errors across all pages
- ✅ All existing features work (no regression)
- ✅ All new pages match dark theme
- ✅ Mobile menu works correctly
- ✅ All acceptance scenarios pass
- ✅ Performance goals met

**Checkpoint**: All user stories verified, feature complete and ready for review

---

## Implementation Strategy

### MVP Scope (Deliver First)
**User Story 1 + User Story 2** (Both P1 priority):
- These deliver core navigation functionality
- Can be deployed independently
- Provides immediate user value
- No dependencies between them (can be parallel)

### Incremental Delivery Order
1. **Phase 1** → Foundation (auth utilities)
2. **Phase 3 + Phase 4** → MVP (US1 + US2 in parallel)
3. **Phase 5** → Profile personalization (US3)
4. **Phase 6** → Security (US4)
5. **Phase 7** → Polish and verification

### Parallel Execution Opportunities

**After Phase 1 completes, these can run in parallel**:

**Group A - Navigation (US1)**:
- T003 (Sidebar hrefs)
- T004 (Calendar page)
- T005 (Reminders page)
- T006 (Notes page)
- T007 (Settings page)

**Group B - Logo (US2)**:
- T008 (Logo link) - can run anytime after Phase 1

**Group C - Profile (US3)**:
- T009 (Sidebar profile)
- T010 (Header profile)

**Group D - Logout (US4)**:
- T011 (Logout verification) - can run anytime

**Maximum parallelism**: All tasks T003-T011 can run simultaneously after Phase 1

### Dependencies Graph

```
Phase 1 (T001, T002)
    ↓
    ├─→ Phase 3: US1 (T003, T004, T005, T006, T007) [Can run in parallel]
    ├─→ Phase 4: US2 (T008) [Can run in parallel]
    ├─→ Phase 5: US3 (T009, T010) [Can run in parallel]
    └─→ Phase 6: US4 (T011) [Can run in parallel]
    ↓
Phase 7: Polish (T012-T017) [Requires all above complete]
```

### Independent Testing Per Story

Each user story phase includes "Independent Test" criteria that can be verified without other stories:

- **US1**: Test navigation by clicking each sidebar item
- **US2**: Test logo click from any page
- **US3**: Test profile display after login
- **US4**: Test logout flow and session clearing

This enables:
- ✅ Parallel development by different team members
- ✅ Incremental deployment (ship US1+US2 first)
- ✅ Easier debugging (isolate issues to specific story)
- ✅ Flexible prioritization (can defer US3/US4 if needed)

---

## Task Summary

**Total Tasks**: 17
- Phase 1 Setup: 2 tasks
- Phase 2 Foundational: 0 tasks (not needed)
- Phase 3 US1 (P1): 5 tasks
- Phase 4 US2 (P1): 1 task
- Phase 5 US3 (P2): 2 tasks
- Phase 6 US4 (P2): 1 task
- Phase 7 Polish: 6 tasks

**Parallelizable Tasks**: 11 tasks (T003-T011, T014, T015)
- After Phase 1, up to 9 implementation tasks can run simultaneously
- Phase 7 verification tasks can run in any order

**User Stories**:
- US1 (Navigate Sidebar): 5 tasks - Core navigation functionality
- US2 (Logo Click): 1 task - Homepage navigation
- US3 (Profile Display): 2 tasks - User personalization
- US4 (Sign Out): 1 task - Security/session management

**Estimated Implementation Time**: 2-3 hours (per quickstart.md)
**Complexity**: Low (UI integration only, no backend changes)
**Risk**: Low (additive feature, no breaking changes)

---

## Validation Checklist

✅ All tasks follow required format: `- [ ] [ID] [P?] [Story?] Description with file path`
✅ Tasks organized by user story (one phase per story)
✅ Each user story has "Independent Test" criteria
✅ Dependencies clearly documented
✅ Parallel execution opportunities identified
✅ MVP scope defined (US1 + US2)
✅ File paths are specific and absolute
✅ No test tasks (manual testing specified)
✅ All tasks trace back to spec requirements
✅ Incremental delivery strategy documented
