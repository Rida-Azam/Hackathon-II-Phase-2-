# Phase II UI/UX Specification – Todo App Dashboard & Auth Pages

**Feature Branch**: `005-dark-theme-dashboard`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description based on reference image for a minimalist dark mode dashboard and auth experience.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Premium Login Experience (Priority: P1)

As a returning user, I want to see a professional and clean dark-themed login card so that I feel focused during my task management session.

**Why this priority**: The login page is the entry point. A clean, high-fidelity dark UI establishes immediate trust and aesthetic value.

**Independent Test**: Visit the /login route and verify the presence of a minimalist dark card with username/password fields and high-contrast "Log In" button.

**Acceptance Scenarios**:

1. **Given** I am on the Login page, **When** I view the layout, **Then** I see a dark card with a black background (`#000000`) and modern Inter typography.
2. **Given** the login card is displayed, **When** I click "Log In", **Then** I am navigated to the central dashboard.

---

### User Story 2 - Persistent Sidebar Navigation (Priority: P1)

As a logged-in user, I want a functional sidebar menu so that I can switch between Tasks, Calendar, and Settings without losing context.

**Why this priority**: Navigation structure is vital for multitasking and organization.

**Independent Test**: On the dashboard, verify a left sidebar containing: Dashboard (Active), Tasks, Calendar, Reminders, Notes, and Settings.

**Acceptance Scenarios**:

1. **Given** I am on the dashboard, **When** I view the sidebar, **Then** the "Dashboard" item is visually highlighted in a high-contrast accent color.
2. **Given** a tablet screen, **When** I view the dashboard, **Then** the sidebar remains accessible or correctly collapses per the responsive logic.

---

### User Story 3 - Visual Task List (Priority: P2)

As a user, I want my tasks to be organized in a central list with metadata so that I can track due dates and progress easily.

**Why this priority**: The central task list is where core productivity occurs. High visual clarity reduces cognitive load.

**Independent Test**: On the dashboard, verify that tasks occupy the center pane and include a checkbox, title, and "Pendives" (due dates/tags).

**Acceptance Scenarios**:

1. **Given** I have pending tasks, **When** I view the task list, **Then** each task is displayed with a minimalist checkbox and a three-dot action menu.
2. **Given** a task title, **When** I read the text, **Then** it is rendered in a modern Inter sans-serif font for maximum legibility.

---

### Edge Cases

- **Small Screens**: Sidebar must collapse into a mobile-friendly nav bar or drawer.
- **Empty States**: If no tasks exist, a minimalist dark placeholder should be displayed in the center pane.
- **Long Titles**: Extremely long titles should truncate with an ellipsis (`...`) within the card boundary.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement a "Dull yet attractive" minimalist dark theme based on a black/very dark gray background.
- **FR-002**: System MUST use the **Inter** (or equivalent) sans-serif font family.
- **FR-003**: The Dashboard MUST feature a top-right header section with the user name ("Soetly") and a circular avatar.
- **FR-004**: The Dashboard MUST include a persistent search bar in the top-center or top-right header area.
- **FR-005**: The Login and Signup pages MUST feature card-based layouts.
- **FR-006**: The sidebar MUST include exactly six items: Dashboard, Tasks, Calendar, Reminders, Notes, and Settings.
- **FR-007**: Task cards MUST display "Pendives" (due dates or tags) in a subtle, low-saturation font.

### Key Entities *(include if feature involves data)*

- **UI State**: Represents the current theme (Dark/Standard), active sidebar link, and sidebar collapse state.
- **Dashboard Layout**: Represents the grid structure containing Sidebar, Header, and Main Content area.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: UI responsiveness score on Google Lighthouse (Desktop/Mobile) maintains >= 90.
- **SC-002**: 100% of functional paths (Login to Dashboard) are navigable without layout breakage.
- **SC-003**: Subjective "minimalist dark aesthetic" verified by visual parity with the reference mockup.
- **SC-004**: Search bar interaction focus state is visually distinct in high-fidelity dark mode.
