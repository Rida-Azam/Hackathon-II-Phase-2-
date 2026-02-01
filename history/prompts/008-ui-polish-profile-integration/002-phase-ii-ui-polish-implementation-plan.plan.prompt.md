---
id: 002
title: Phase II UI Polish Implementation Plan
stage: plan
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5
feature: 008-ui-polish-profile-integration
branch: 008-ui-polish-profile-integration
user: system
command: /sp.plan
labels: ["planning", "ui-polish", "profile-integration", "phase-ii", "architecture"]
links:
  spec: specs/008-ui-polish-profile-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/008-ui-polish-profile-integration/plan.md
 - specs/008-ui-polish-profile-integration/research.md
 - specs/008-ui-polish-profile-integration/data-model.md
 - specs/008-ui-polish-profile-integration/quickstart.md
 - specs/008-ui-polish-profile-integration/contracts/navigation-flow.md
 - CLAUDE.md
tests:
 - Constitution check passed (all compliance verified)
 - Research phase completed (7 research questions resolved)
 - Data model defined (4 entities documented)
 - Navigation contracts specified (4 routes + 4 flows)
---

## Prompt

/sp.plan

# Phase II Functional & UI Polish Specification – Evolution of Todo
Full-Stack Web Todo Application – Final Stabilization & Profile Integration

## 1. Overview & Goal
**Phase**: Phase II (post-core functionality)
**Objective**: Make the full application **fully functional** with the current black/dark theme dashboard, fix all non-working buttons, integrate profile display, and ensure smooth navigation.

**Current Working Parts (Confirmed)**:
- Login / Signup works
- /todos dashboard loads and stays open after login
- Add new task works
- Toggle complete/incomplete works
- Black/dark theme applied

**Remaining Requirements**:
- All sidebar buttons (Dashboard, Tasks, Calendar, Reminders, Notes, Settings) must be functional or redirect appropriately
- Top-left "Todo" logo click → redirect to homepage (localhost:3000 or /)
- Profile button (bottom-left with name "Soetly" / avatar) → show user name from auth
- Sign Out button → already working, but confirm it clears session and redirects to login
- Show logged-in user's name in "ACTIVE NOW" profile section
- No new features — only make existing UI elements functional

**Governing Documents**:
- Constitution.md (phase isolation – no new functional features)
- Phase II spec/plan (existing REST API, auth, black theme)

## 2. Functional Requirements
### Navigation & Buttons
- Top-left "Todo" logo → click redirects to homepage (/)
- Sidebar menu:
  - Dashboard → current page (/todos)
  - Tasks → same as Dashboard or show filtered task list
  - Calendar → placeholder page or message "Coming soon"
  - Reminders → placeholder
  - Notes → placeholder
  - Settings → placeholder page with user info
- Profile section (bottom-left):
  - Show logged-in user's name (from Better Auth session)
  - Avatar / icon
  - "PRO MEMBER" badge (static for now)
  - "ACTIVE NOW" status
- Sign Out button (top-right or profile) → clear token/session → redirect to /login

### Auth Integration
- After login, display user's name in profile (from Better Auth session or API)
- If no name, fallback to email or "User"

## 3. UI/UX Requirements
- Keep black/dark theme (no changes to colors/fonts)
- Make sidebar clickable with hover effects
- Profile section: show real name dynamically
- All buttons: cursor-pointer, hover blue glow or scale
- Responsive: sidebar collapses to hamburger on mobile

## 4. Acceptance Criteria
- Click "Todo" logo → go to homepage (landing page)
- Click any sidebar item → either stay on /todos or go to placeholder
- Profile shows correct user name after login
- Sign Out → logs out and redirects to login
- No console errors on clicks
- No redirect loops

## Response snapshot

Successfully created comprehensive implementation plan for Phase II UI Polish & Profile Integration:

**Branch**: `008-ui-polish-profile-integration`
**Plan File**: `specs/008-ui-polish-profile-integration/plan.md`

**Constitution Check Results**: ✅ ALL PASSED
- Phase II scope verified (Next.js 16+, Better Auth, dark theme)
- No future-phase leakage
- No feature invention (all from approved spec)
- Spec-Driven Development compliance verified
- Quality principles compliance verified
- Technology constraints compliance verified

**Phase 0: Research Completed**
Generated `research.md` with 7 research questions resolved:
1. How to retrieve user information from Better Auth session → Use localStorage + auth utility
2. Navigation in Next.js App Router → Use Link components with proper hrefs
3. Logo clickable → Wrap in Link href="/"
4. User name integration → useEffect + useState pattern
5. Placeholder pages design → Centered "Coming Soon" with dark theme
6. Settings page content → Read-only profile info display
7. Sign-out verification → Ensure both localStorage and cookies cleared

**Phase 1: Design & Contracts Completed**

Generated comprehensive documentation:

1. **data-model.md** - Component state models:
   - User Session (browser storage)
   - User Profile (derived data)
   - Navigation State (component state)
   - Navigation Item (static config)
   - Component state models for Sidebar, Header, Settings

2. **contracts/navigation-flow.md** - Navigation contracts:
   - 4 existing routes (no changes)
   - 4 new routes (calendar, reminders, notes, settings)
   - Component contracts (Sidebar, Header, Auth Utility, Placeholders, Settings)
   - 4 user flows documented
   - Error handling contracts
   - Accessibility contracts
   - Performance contracts
   - Security contracts

3. **quickstart.md** - Development guide:
   - 6 implementation phases
   - Comprehensive testing checklist (30+ items)
   - Common issues & solutions
   - Code snippets for all components
   - Security and performance notes

**Project Structure Defined**:
- Frontend only changes (no backend modifications)
- 2 components to modify (Sidebar, Header)
- 4 new page components (Calendar, Reminders, Notes, Settings)
- 2 new utility files (lib/auth.ts, types/auth.ts)
- Existing middleware requires no changes

**Technical Decisions**:
- TypeScript 5.x with Next.js 16.1.1 App Router
- React 19.2.3 client components
- localStorage + cookies for session management
- Mock user data for Phase II (JWT decoding future phase)
- Next.js Link components for all navigation
- Dark theme maintained with existing Tailwind classes

**Agent Context Updated**:
- Added TypeScript + Next.js to CLAUDE.md
- Added browser storage context
- Preserved manual additions

## Outcome

- ✅ Impact: Complete implementation plan created for Phase II UI stabilization, enabling functional navigation and profile integration without backend changes
- 🧪 Tests: Constitution compliance verified, all research questions resolved, contracts defined
- 📁 Files: 6 files created (plan.md, research.md, data-model.md, quickstart.md, contracts/navigation-flow.md, CLAUDE.md updated)
- 🔁 Next prompts: `/sp.tasks` to generate actionable task list from this plan
- 🧠 Reflection: Plan successfully balances minimal changes (UI integration only) with comprehensive documentation. All design decisions traced back to spec requirements. No constitution violations. Ready for task generation.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning completed without blockers
- Graders run and results (PASS/FAIL): PASS - Constitution check passed, research complete, contracts defined
- Prompt variant (if applicable): Standard /sp.plan workflow
- Next experiment (smallest change to try): Proceed to task generation to break down implementation into testable units
