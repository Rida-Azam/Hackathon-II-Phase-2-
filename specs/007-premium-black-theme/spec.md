# Feature Specification: Evolution of Todo - Premium Black Theme

**Feature Branch**: `007-premium-black-theme`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "# Phase II UI/UX Specification – Evolution of Todo
Full-Stack Web Todo Application – Premium Black Theme Landing Page & Auth Pages

## 1. Overview & Goal
**Phase**: Phase II (post-functional completion)
**Objective**: Redesign the landing page (/), login, and signup pages of the existing full-stack Todo application to match the premium, modern, flat black/dark theme aesthetic shown in the reference Figma-inspired screenshot.

**Core Visual Style (from screenshot)**:
- Pure black/dark background (#000 or #0a0a0a)
- White/gray text with blue or teal accents for buttons & highlights
- Flat/minimalist design with subtle gradients and shadows
- Hero section with large title, tagline, feature cards, mobile mockups, CTA buttons
- Premium, professional, productivity-focused look (similar to Notion/Todoist/Linear style)

**Requirements**:
- Strict black/dark theme only (no light mode)
- Attractive, centered login and signup forms
- Beautiful, motivating homepage (landing) with hero, features, and CTAs
- Modern, readable fonts
- Fully responsive (mobile + desktop)
- No functional changes — only visual polish, layout, and subtle interactions

**Governing Documents**:
- Constitution.md (phase isolation – no new functional elements)
- Phase II spec/plan (existing architecture unchanged)

## 2. Theme Requirements (Premium Black/Dark)
- Primary background: #000000 or #0a0a0a
- Secondary surfaces/cards: #111111 or #1a1a1a with subtle gradient or shadow
- Text primary: #ffffff or #e0e0e0
- Text secondary: #a0a0a0 (taglines, descriptions)
- Accents: #3b82f6 (blue) or #0ea5e9 (teal/blue) for buttons, links, highlights
- Borders/dividers: #222222
- Hover/focus: scale-105 + brightness + blue glow
- Shadows: soft dark shadow (shadow-black/40)

## 3. Fonts
- Primary font: Inter (clean, modern, readable – Google Fonts)
- Headings/emphasis: Poppins or Manrope (bold, elegant)
- Weights: 300–700
- Fallback: system-ui, sans-serif

## 4. Homepage / Landing Page (/) Requirements
**Layout (from screenshot)**:
- Full-screen hero section (centered)
  - Large title: "Todo Evolution" or "To-Do List" (Poppins bold, white/blue gradient)
  - Tagline: "Transform your productivity..." (Inter regular, gray-white)
  - Two buttons: "Get Started" (blue bg, hover brighter) + "Sign In" (outline blue)
- Feature cards section: 3–4 dark cards with icons, titles ("Task Management", "Collaboration", etc.), short descriptions
- Mobile app mockups: floating phone screens showing app UI (optional illustration)
- Bottom CTA: "Get Started for Free" or similar

**Visual Style**:
- Black background with subtle gradient or grain texture
- Cards: rounded-xl, bg-[#111], border-[#222], hover:border-blue-500
- Buttons: rounded-lg, bold, scale on hover

## 5. Login & Signup Forms Requirements
**Visual Style**:
- Centered card (max-w-md mx-auto, bg-[#111], border-[#222], shadow-2xl)
- Heading: "Sign in to your account" / "Create your account" (Poppins bold white)
- Inputs: bg-[#1a1a1a], border-[#333], text-white, focus:ring-blue-500, rounded-lg
- Button: full-width, bg-gradient-to-r from-blue-600 to-indigo-600, hover:scale-105
- Link: blue underline on hover

**Layout**:
- Vertical stack, generous padding
- Error messages: red below input

## 6. General UI/UX Guidelines
- Animations: fade-in on load, scale on hover/button press
- Hover effects: card lift, button brightness
- Spacing: 4px/8px grid
- Accessibility: high contrast, aria-labels, focus-visible styles

## 7. Acceptance Criteria
- Homepage matches screenshot style: hero title, tagline, feature cards, CTAs
- Login/signup forms are premium, centered, black-themed
- Responsive on mobile (stacked cards) and desktop
- No functional regression – CRUD/auth still work
- Pure black/dark theme throughout

End of Phase II UI/UX Specification – v1.0 (Premium Black Theme Landing & Auth)
This defines WHAT the visual upgrade must deliver."

## User Scenarios & Testing

### User Story 1 - Immersive Landing Page Experience (Priority: P1)

A new user visits the application root for the first time. They are greeted by a high-impact, premium black-themed hero section that clearly explains the value proposition ("Transform your productivity...") and provides clear paths to either join or sign in.

**Why this priority**: The landing page is the "face" of the application. It establishes the premium brand identity and drives conversion for new users.

**Independent Test**: Can be verified by accessing `/` in a browser. The user should see a full-screen hero section with correct typography (Poppins/Inter) and color palette (#000000 bg, blue accents) without needing to log in.

**Acceptance Scenarios**:

1. **Given** an unauthenticated state, **When** visiting `/`, **Then** the page renders with a pure black background and the "Todo Evolution" title in bold Poppins.
2. **Given** the landing page, **When** scrolling down, **Then** 3–4 feature cards are visible with rounded corners, subtle borders (#222222), and hover effects.
3. **Given** the mobile viewport, **When** viewing the landing page, **Then** the hero section and feature cards stack vertically and maintain readability.

---

### User Story 2 - Premium Authentication Flow (Priority: P1)

An existing or prospective user navigates to the login or signup pages. They see a centered, sophisticated dark card where they can enter their credentials. The forms feel professional and high-performance, with smooth interactions and clear feedback.

**Why this priority**: Essential for user access. The visual quality of the auth flow reinforces the security and professional nature of the "Evolution" product.

**Independent Test**: Navigate to `/login` or `/signup`. Verify the centered card layout, glassmorphism/gradient effects, and that form validation messages are clearly visible.

**Acceptance Scenarios**:

1. **Given** the login page, **When** focusing an input field, **Then** the border changes color and a blue glow effect appears.
2. **Given** invalid credentials on the signup form, **When** submitting, **Then** error messages appear in red below the relevant inputs within the dark card.
3. **Given** a successful login/signup, **When** the transition occurs, **Then** the user is redirected to their dashboard while maintaining the dark theme immersion.

---

### Edge Cases

- **Viewport Transitions**: How does the centered auth card behave on extremely small mobile screens (e.g., < 320px width)?
- **Long Text Input**: What happens if a user types a very long email or name that exceeds button/input widths in the minimalist design?
- **Network Latency**: How is the "hover scale-105" or "fade-in" animation perceived if the app bundle is still loading or if the connection is slow?

## Requirements

### Functional Requirements

- **FR-001**: System MUST implement a pure black global theme (#000000) for the landing, login, and signup pages.
- **FR-002**: System MUST load and apply "Inter" for body text and "Poppins" for headings via a modern web font integration.
- **FR-003**: System MUST provide a responsive hero section at `/` featuring a large title with blue/teal gradient text.
- **FR-004**: System MUST display 3–4 interactive feature cards with rounded-xl corners and subtle border/glow effects on hover.
- **FR-005**: Auth forms MUST be contained within a centered, max-width card featuring a subtle background contrast (#111111) and shadow-2xl.
- **FR-006**: Registration and Login inputs MUST provide visual focus states using blue/teal accents.
- **FR-007**: System MUST support smooth CSS transitions for hover states (e.g., scale-105, brightness adjustments) and page entry (fade-in).

### Key Entities

- **UI Theme Configuration**: Represents the centralized store for colors, fonts, and spacing variables used across the new layouts.
- **Auth Card Component**: A reusable layout entity representing the centered, premium card used for login, signup, and potentially future auth-related views.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Page load speed for the landing page remains under 1.5 seconds on standard connection to maintain "premium" feel.
- **SC-002**: 100% of tested mobile devices (iOS/Android) render the hero section without horizontal scrolling.
- **SC-003**: Lighthouse Accessibility score matches or exceeds 95 for the new dark theme pages (ensuring contrast ratios are compliant).
- **SC-004**: Zero functional regressions in the login/signup POST flows after applying the new visual styles.
