# Implementation Plan: Phase II UI Polish & Profile Integration

**Branch**: `008-ui-polish-profile-integration` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-ui-polish-profile-integration/spec.md`

## Summary

Make the Todo application fully functional by connecting existing UI elements to navigation logic and authentication session. This involves:
- Making all sidebar menu items functional (Dashboard, Tasks, Calendar, Reminders, Notes, Settings)
- Adding click handler to "Todo" logo to navigate to homepage
- Integrating Better Auth session to display user's name dynamically in profile sections (sidebar and header)
- Verifying sign-out functionality properly clears session and redirects
- Creating simple placeholder pages for Calendar, Reminders, and Notes
- Maintaining consistent black/dark theme across all changes

**Technical Approach**: This is purely a frontend UI integration task. No backend changes required. Use existing Next.js client components, React hooks (useState, useEffect), Next.js router for navigation, and localStorage/cookies for session management (already implemented).

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.1.1 (App Router), React 19.2.3
**Primary Dependencies**:
- Next.js 16.1.1 (App Router for routing, middleware)
- React 19.2.3 (UI components, hooks)
- Better Auth 1.4.10 (authentication - currently installed but not fully integrated for profile display)
- Lucide React 0.562.0 (icons)
- Tailwind CSS 4.x (styling)
- Axios 1.13.2 (API client)

**Storage**: Browser localStorage and cookies for session tokens (already implemented)
**Testing**: Manual browser testing against acceptance criteria
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend + backend) - Only frontend changes needed
**Performance Goals**: Instant navigation (<100ms), profile name loads within 1 second
**Constraints**:
- Must maintain existing black/dark theme styling
- No regression of existing features (add task, toggle complete, login/signup)
- No changes to backend or API
- Work with existing Better Auth installation (session management already works)

**Scale/Scope**:
- 6 sidebar nav items to wire up
- 1 logo click handler
- 2 profile components to update (sidebar + header)
- 3 placeholder pages to create (Calendar, Reminders, Notes)
- 1 settings page to create

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase Governance Compliance

✅ **Phase II Scope Verified**: This feature aligns with Phase II specifications:
- Uses Next.js 16+ with App Router ✓
- Works with existing Better Auth JWT implementation ✓
- Frontend-only changes (no backend modifications) ✓
- Maintains existing black/dark theme ✓

✅ **No Future-Phase Leakage**:
- No Phase III features (AI agents, chat interfaces)
- No Phase IV features (containerization, Kubernetes)
- No Phase V features (Kafka, microservices)

✅ **No Feature Invention**:
- All requirements come directly from approved specification
- Sidebar navigation items already exist in UI
- Profile sections already exist with hardcoded data
- Better Auth is already installed and configured
- Only connecting existing pieces together

### Spec-Driven Development Compliance

✅ **Specification Exists**: `specs/008-ui-polish-profile-integration/spec.md` approved and complete
✅ **No Manual Coding**: All implementation will be AI-generated based on this plan
✅ **Traceability**: All changes map to functional requirements (FR-001 through FR-020)

### Quality Principles Compliance

✅ **Clean Architecture**:
- Separation maintained: UI components (Sidebar, Header) separate from routing logic
- Navigation logic centralized in Next.js routing
- Session management encapsulated in authentication utilities

✅ **User Experience**:
- Clear error handling for auth failures (redirect to login)
- Friendly placeholder messages for Coming Soon pages
- Responsive design maintained (existing mobile hamburger menu)

### Technology Constraints Compliance

✅ **Phase II Technology Stack**: All technologies align with Phase II specifications
- Next.js 16.1.1 (App Router) ✓
- React 19.2.3 ✓
- Better Auth 1.4.10 ✓
- Tailwind CSS 4.x ✓
- TypeScript 5.x ✓

**No violations identified. Proceeding to Phase 0 research.**

## Project Structure

### Documentation (this feature)

```text
specs/008-ui-polish-profile-integration/
├── spec.md              # Feature specification
├── plan.md              # This file (/sp.plan output)
├── research.md          # Phase 0 output (research findings)
├── data-model.md        # Phase 1 output (component state models)
├── quickstart.md        # Phase 1 output (development guide)
├── contracts/           # Phase 1 output (component interfaces)
│   └── navigation-flow.md
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created yet)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/          # Existing React components
│   │   ├── Sidebar.tsx      # [MODIFY] Add navigation handlers, integrate auth for profile
│   │   ├── Header.tsx       # [MODIFY] Add logo link, integrate auth for user name
│   │   ├── ThemeToggle.tsx  # [NO CHANGE] Existing theme toggle
│   │   ├── TodoItem.tsx     # [NO CHANGE] Existing task item
│   │   ├── AuthCard.tsx     # [NO CHANGE] Existing auth UI
│   │   └── FeatureCard.tsx  # [NO CHANGE] Existing landing page card
│   │
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # [NO CHANGE] Homepage/landing page
│   │   ├── layout.tsx       # [NO CHANGE] Root layout
│   │   ├── provider.tsx     # [NO CHANGE] Theme provider
│   │   ├── login/
│   │   │   └── page.tsx     # [NO CHANGE] Login page
│   │   ├── signup/
│   │   │   └── page.tsx     # [NO CHANGE] Signup page
│   │   ├── todos/
│   │   │   └── page.tsx     # [MINOR MODIFY] Verify logout handler
│   │   ├── calendar/        # [NEW] Placeholder page
│   │   │   └── page.tsx
│   │   ├── reminders/       # [NEW] Placeholder page
│   │   │   └── page.tsx
│   │   ├── notes/           # [NEW] Placeholder page
│   │   │   └── page.tsx
│   │   └── settings/        # [NEW] Settings page with user info
│   │       └── page.tsx
│   │
│   ├── lib/                 # Utilities
│   │   ├── api.ts           # [NO CHANGE] Axios API client
│   │   ├── utils.ts         # [NO CHANGE] Utility functions
│   │   └── auth.ts          # [NEW] Auth helper to get user from session
│   │
│   ├── types/
│   │   └── todo.ts          # [NO CHANGE] Existing Task type
│   │
│   └── middleware.ts        # [NO CHANGE] Existing auth middleware
│
├── package.json             # [NO CHANGE] Existing dependencies
└── .env.local               # [NO CHANGE] Environment variables

backend/                     # [NO CHANGES TO BACKEND]
```

**Structure Decision**: Web application structure (frontend + backend) is appropriate. Only frontend modifications required as all backend APIs and authentication are already functional. The existing Next.js App Router structure supports all navigation requirements without restructuring.

## Complexity Tracking

No constitution violations. This section is intentionally empty.

