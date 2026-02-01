# Verification Guide: Phase II UI/UX Dashboard

**Feature**: `005-dark-theme-dashboard` | **Date**: 2026-01-03

## 1. Quick Verification (Manual)

### Auth Pages Overhaul
- [ ] Visit `/login` and `/signup`.
- [ ] Verify **Glassmorphism**: Backdrop blur is visible on the auth cards.
- [ ] Verify **Background**: Subtle gradients are present behind the card.
- [ ] Verify **Typography**: Labels and buttons use the **Inter** font.

### Dashboard Layout
- [ ] Log in and enter the dashboard.
- [ ] Verify **OLED Black**: The main background is pure black (`#000000`).
- [ ] Verify **Sidebar**: Persistent left nav containing 6 items (Dashboard to Settings).
- [ ] Verify **Header**: Search bar and user "Soetly" are visible at the top.
- [ ] Verify **Theme Toggle**: Clicking the toggle switches between modes with < 100ms lag.

### Task List
- [ ] Verify **Metadata**: Due dates/tags (Pendives) are visible in a muted font.
- [ ] Verify **Hover States**: Task items have a subtle surface highlight on hover.
- [ ] Verify **Responsiveness**: Sidebar collapses correctly on mobile viewports.

## 2. Automated Regression Tests

Run the Playwright visual regression suite:

```bash
npx playwright test specs/005-dark-theme-dashboard/ui.spec.ts
```

*Note: Visual snapshots must match the "Premium Minimalist" baseline.*

## 3. Performance Check

- [ ] Run Lighthouse in Chrome DevTools.
- [ ] Goal: **Accessibility >= 95**, **Performance >= 90**.
- [ ] Verify no "Layout Shift" (CLS) when switching themes.
- [ ] Verify FOUC script prevents white flash on refresh.
