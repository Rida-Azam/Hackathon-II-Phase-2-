# Implementation Plan: UI/UX Enhancement

**Branch**: `004-ui-ux-enhancement` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-ui-ux-enhancement/spec.md`

## Summary

Enhance the Phase II Todo application with a modern, professional UI/UX upgrade. This includes a robust Dark/Light theme system, premium typography (Inter/Poppins), glassmorphism components for Auth, and a motivating dashboard with smooth interactions and responsive layouts. All changes are strictly visual/UX and maintain existing backend integration.

## Technical Context

**Language/Version**: TypeScript 5.x, Python 3.13 (FastAPI)
**Primary Dependencies**: Next.js 16 (App Router), Tailwind CSS, Lucide React, Axios
**Storage**: `localStorage` for theme persistence
**Testing**: Manual verification using Quickstart scenarios
**Target Platform**: Web (Chrome, Safari, Firefox)
**Project Type**: Full-stack Web Application
**Performance Goals**: UI transitions < 200ms, Accessibility score > 90
**Constraints**: No new functional features, no new libraries beyond current stack, mobile-first design.
**Scale/Scope**: UI overhaul of 3 main areas (Auth, Dashboard, Theme)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Phase Governance**: Strictly visual upgrade, no feature invention or Phase III+ leak.
✅ **Technology Constraints**: Uses existing Next.js/Tailwind stack.
✅ **SDD Compliance**: Plan derived from spec.md.
✅ **Quality Principles**: Clean separation of UI styles from business logic.

## Project Structure

### Documentation (this feature)

```text
specs/004-ui-ux-enhancement/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Visual technical decisions
├── data-model.md        # UI state model
├── quickstart.md        # Verification guide
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ThemeToggle.tsx      # NEW: Sun/Moon toggle
│   │   ├── Toast.tsx            # NEW: Feedback notification
│   │   ├── Modal.tsx            # NEW: Confirmation dialog
│   │   └── TodoItem.tsx         # MODIFY: Modern styling
│   ├── app/
│   │   ├── layout.tsx           # MODIFY: Theme class application & Fonts
│   │   ├── provider.tsx         # NEW: Theme provider (lightweight)
│   │   ├── login/page.tsx       # MODIFY: Glassmorphism auth card
│   │   ├── signup/page.tsx      # MODIFY: Glassmorphism auth card
│   │   └── todos/page.tsx       # MODIFY: Dashboard layout & Skeletons
│   └── styles/
│       └── globals.css          # MODIFY: Google Fonts imports & Tailwind config
```

**Structure Decision**: Web application focused. Adding lightweight UI components to `frontend/src/components/` and updating the Next.js App Router layout/pages.

## Phase 0: Research & Technology Decisions

*Detailed in [research.md](./research.md)*

- **Theme Strategy**: Tailwind `dark:` variants with `html.dark` class toggle.
- **Font Implementation**: `next/font/google` for Inter (San-serif) and Poppins (Headings).
- **Persistence**: `localStorage` with a sync script in Layout to prevent FOUC.
- **Feedback**: Custom Tailwind-based Toast and Modal components to avoid heavy dependencies.

## Phase 1: Design & Contracts

*Detailed in [data-model.md](./data-model.md)*

- **Entities**: Focused on UI Theme State and Toast Notifications.
- **API Contracts**: No changes. Reusing existing REST endpoints.
- **Animations**: Standard Tailwind transitions (200ms) and scale effects (102%).

## Phase 2: Implementation Strategy

1. **Foundational UI**:
   - Update `globals.css` and `layout.tsx` with Fonts and Theme script.
   - Implement `ThemeToggle` and `ThemeProvider`.
2. **Auth Experience**:
   - Redesign Login and Signup pages with the centered glassmorphism card.
   - Add focus glow and button animations.
3. **Dashboard Experience**:
   - Update `TodosPage` layout (header, add bar, responsive container).
   - Redesign `TodoItem` card with subtle hover effects.
   - Add Empty State and Skeleton loaders.
4. **Delight & Polish**:
   - Implement Toast feedback for all CRUD actions.
   - Replace native confirm with custom Modal.
   - Final accessibility check (contrast/labels).
