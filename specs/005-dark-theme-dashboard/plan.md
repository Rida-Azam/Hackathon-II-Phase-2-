# Implementation Plan: UI/UX Enhancement

**Branch**: `005-dark-theme-dashboard` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-dark-theme-dashboard/spec.md`

## Summary

Enhance the Phase II Todo application with a modern, high-fidelity minimalist dark mode experience. This includes a robust theme system, glassmorphic auth cards, and a sophisticated dashboard layout inspired by premium minimalist design. All changes are strictly visual and UX-focused, maintaining existing backend integration.

## Technical Context

**Language/Version**: TypeScript 5.7+ (Frontend), Python 3.13 (Backend)
**Primary Dependencies**: Next.js 16 (App Router), Tailwind CSS v4, Lucide React, FastAPI
**Storage**: localStorage (Theme persistence), SQLite (Tasks data)
**Testing**: Manual visual verification, Playwright (UI flows)
**Target Platform**: Web (Chrome, Safari, Firefox, Mobile Viewports)
**Project Type**: Web Application
**Performance Goals**: < 100ms theme toggle speed, 유지보수성 90+ lighthouse score
**Constraints**: strictly visual/UX, no functional logic changes, no library bloat
**Scale/Scope**: Auth (Login/Signup), Core Dashboard, Navigation sidebar

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Status | Note |
|------|--------|------|
| I. Spec-Driven Development | ✅ PASS | Plan derived from vision in spec.md |
| II. No Feature Invention | ✅ PASS | Strictly styling/layout; no new functional features |
| III. Phase Governance | ✅ PASS | No leakage into Phase III+ functionality |
| IV. Technology Constraints | ✅ PASS | Uses existing Next.js/Tailwind stack |
| V. Quality Principles | ✅ PASS | Maintaining clean separation of styles and logic |

## Project Structure

### Documentation (this feature)

```text
specs/005-dark-theme-dashboard/
├── spec.md              # Requirement specification
├── plan.md              # This file
├── research.md          # Technical decisions (Dark mode, Layout)
├── data-model.md        # UI state model
└── quickstart.md        # Verification guide
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx      # NEW: Navigation sidebar
│   │   ├── Header.tsx       # NEW: Search + User info
│   │   ├── ThemeToggle.tsx  # NEW: Sun/Moon toggle
│   │   └── TodoItem.tsx     # MODIFY: Updated list style
│   ├── app/
│   │   ├── layout.tsx       # MODIFY: FOUC script & Fonts
│   │   ├── globals.css      # MODIFY: Tailwind v4 theme vars
│   │   ├── login/page.tsx   # MODIFY: Card redesign
│   │   ├── signup/page.tsx  # MODIFY: Card redesign
│   │   └── todos/page.tsx   # MODIFY: Layout orchestration
```

**Structure Decision**: Web application project structure. Utilizing local `components/` for new layout primitives.

## Phase 0: Research & Technology Decisions

*Detailed in [research.md](./research.md)*

- **Decision 1: FOUC Prevention**: Inline blocking script checking `localStorage` in the HTML `<head>`.
- **Decision 2: Color Palette**: OLED Black (`#000000`) for primary background, Deep Surface (`#1A1A1A`) for cards, and Off-white (`#EDEDED`) for text.
- **Decision 3: Glassmorphism**: `backdrop-blur-xl` + `border-white/10` for auth cards.
- **Decision 4: Responsive Sidebar**: Fixed sidebar for desktop (`lg:` upward), Modal-style drawer for mobile.

## Phase 1: Design & Contracts

- **Entities**: Defined in [data-model.md](./data-model.md). Focused on `UIState` and `SidebarNavigation`.
- **API Contracts**: No changes. Reuses existing `/api/todos` and auth mock endpoints.
- **Verification**: Defined in [quickstart.md](./quickstart.md).

## Phase 2: Implementation Strategy

### 1. Foundational Theme & Fonts
- Configure Tailwind v4 `@theme` in `globals.css`.
- Implement `ThemeProvider` and FOUC script in `layout.tsx`.
- Create premium Sun/Moon `ThemeToggle`.

### 2. High-Fidelity Auth Experience
- Overhaul `/login` and `/signup` page structures.
- Implement glassmorphic card container with `backdrop-blur`.
- Apply ambient background gradients (subtle blue/purple).

### 3. Dashboard Infrastructure
- Implement `Sidebar` with active link highlighting.
- Implement `Header` with search bar and "Soetly" user branding.
- Restructure `todos/page.tsx` for the Sidebar | Main scrollable area layout.

### 4. Visual Polish & Validation
- Update `TodoItem` to match the minimalist list style (Inter font, subtle metadata).
- Perform cross-browser responsiveness check.
- Final verify walkthrough via `quickstart.md`.
