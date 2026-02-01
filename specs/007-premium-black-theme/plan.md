# Implementation Plan: Premium Black Theme Upgrade

**Branch**: `007-premium-black-theme` | **Date**: 2026-01-03 | **Spec**: [./spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-premium-black-theme/spec.md`

## Summary
The goal is to implement a high-end, pure black (#000000) UI for the landing, login, and signup pages. This involves a layout overhaul for the root page (`/`), centering authentication cards with glassmorphism, and introducing premium typography and animations via Framer Motion.

## Technical Context

**Language/Version**: TypeScript (Next.js 16/React 19), Tailwind CSS v4
**Primary Dependencies**: Framer Motion, Lucide React, Google Fonts (Poppins, Inter)
**Storage**: N/A (UI-only change)
**Testing**: Manual visual regression, Lighthouse Accessibility check
**Target Platform**: Responsive Web (Mobile-first)
**Project Type**: Frontend (Next.js Application)
**Performance Goals**: TTI < 1.5s, Lighthouse Accessibility Score >= 95
**Constraints**: Pure black background (#000000 only), no functional changes to existing auth or CRUD flows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven SDD**: Passed (Spec 007 is approved).
- **Agent Boundaries**: Passed (No new functional features proposed).
- **Phase Isolation**: Passed (Changes are limited to landing and auth pages, dashboard remains dashboard).
- **Clean Architecture**: Passed (UI/UX logic is decoupled from backend API).

## Project Structure

### Documentation (this feature)

```text
specs/007-premium-black-theme/
├── spec.md                     # Feature requirements
├── plan.md                     # This file
├── research.md                 # UI patterns and best practices
├── data-model.md               # UI state and theme variables
└── tasks.md                    # Implementation tasks
```

### Source Code (affected files)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css         # Theme variable updates
│   │   ├── layout.tsx          # Font imports
│   │   ├── page.tsx            # Landing redesign
│   │   ├── login/page.tsx      # Login layout update
│   │   └── signup/page.tsx     # Signup layout update
│   └── components/
│       ├── AuthCard.tsx        # Centered card update
│       └── FeatureCard.tsx     # New component for landing
```

**Structure Decision**: Option 2 (Web application) already established.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Framer Motion | Smooth 105% scale and fade-in entry | CSS animations are harder to orchestrate for complex entry sequences |
| Lucide strokeWidth 1.5 | Professional "Linear-style" look | Default 2.0 stroke felt too "bulky" for the premium aesthetic |
