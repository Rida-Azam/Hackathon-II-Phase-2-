---
description: "Task list for Premium Black Theme UI upgrade"
---

# Tasks: Evolution of Todo - Premium Black Theme

**Input**: Design documents from `/specs/007-premium-black-theme/`
**Prerequisites**: plan.md (completed), spec.md (completed), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Update `frontend/src/app/layout.tsx` to import Poppins and Inter fonts from `next/font/google`
- [ ] T002 [P] Install `framer-motion` dependency in `frontend/`
- [ ] T003 [P] Configure global Tailwind CSS v4 custom theme in `frontend/src/app/globals.css` with pure black variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI components and styles needed for all pages

- [ ] T004 Implement premium `AuthCard` layout with glassmorphism in `frontend/src/components/AuthCard.tsx`
- [ ] T005 [P] Create reusable `FeatureCard` component in `frontend/src/components/FeatureCard.tsx`
- [ ] T006 [P] Update Lucide icon configuration to use `strokeWidth={1.5}` as default preference

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Immersive Landing Page Experience (Priority: P1) 🎯 MVP

**Goal**: Redesign the landing page (/) with a high-impact hero section and feature cards.

**Independent Test**: Navigate to `/` unauthenticated. High-impact hero, Poppins headings, and interactive feature cards should be visible.

### Implementation for User Story 1

- [ ] T007 [US1] Redesign hero section in `frontend/src/app/page.tsx` with bold Poppins title and blue gradient
- [ ] T008 [US1] Implement feature cards section in `frontend/src/app/page.tsx` using `FeatureCard` component
- [ ] T009 [P] [US1] Add Framer Motion entry orchestrations (fade-in/scale) to `frontend/src/app/page.tsx`
- [ ] T010 [US1] Update landing page buttons with `scale-105` hover effects

**Checkpoint**: User Story 1 is functional and testable at `/`

---

## Phase 4: User Story 2 - Premium Authentication Flow (Priority: P1)

**Goal**: Redesign login and signup pages with centered premium cards and hover states.

**Independent Test**: Navigate to `/login` and `/signup`. Centered cards, focus glows, and smooth transitions should be functional.

### Implementation for User Story 2

- [ ] T011 [US2] Update login page layout in `frontend/src/app/login/page.tsx` to use the new `AuthCard`
- [ ] T012 [US2] Update signup page layout in `frontend/src/app/signup/page.tsx` to use the new `AuthCard`
- [ ] T013 [P] [US2] Implement input focus glow and border transition in `frontend/src/app/globals.css`
- [ ] T014 [US2] Add Framer Motion entry transitions for auth forms in `frontend/src/components/AuthCard.tsx`

**Checkpoint**: User Story 2 is functional and testable at `/login` and `/signup`

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Responsive checks and final refinements

- [ ] T015 [P] Validate responsive stacking and padding for all new views on mobile viewports
- [ ] T016 Run Lighthouse accessibility audit and ensure OCAG AA contrast compliance
- [ ] T017 Verify all hover state transitions are smooth and performant across browsers

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on T003 - BLOCKS user stories.
- **User Stories (Phase 3+)**: Depend on Phase 2 completion.
- **Polish (Phase 5)**: Depends on all user stories being complete.

### Within Each User Story

- T007-T010 can be done in parallel except for the main page refactor.
- T011-T014 can be done in parallel as they affect different files.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Implement User Story 1 (Landing Page redesign).
3. **STOP and VALIDATE**: Verify the new look and feel at `/`.

### Incremental Delivery

1. Foundation ready.
2. Redesign Landing Page (MVP).
3. Redesign Auth Pages.
4. Final Polish.
