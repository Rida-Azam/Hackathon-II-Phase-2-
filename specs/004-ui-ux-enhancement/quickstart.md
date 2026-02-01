# Quickstart: UI/UX Enhancement

## Developer Guide

### Theme Development
- Always use `dark:` class variants for colors.
- Use `text-foreground` and `bg-background` aliases if custom tailwind config is applied.
- Dark Background: `#0f0f0f`
- Dark Card: `#1e1e1e`
- Light Background: `#f8fafc`

### Typography
- Primary: `font-inter` class.
- Headings: `font-poppins` or `font-manrope`.

### Responsive Testing
- Mobile: `< 640px` (Stacked list).
- Tablet: `640px - 1024px` (2-col grid or wide list).
- Desktop: `> 1024px` (Center constrained).

## Verification Scenarios

### Scenario 1: First Visit
1. Clear localStorage.
2. Visit home page.
3. Verify Dark theme is applied by default.
4. Verify Inter font is loaded.

### Scenario 2: Theme Persistence
1. Switch to Light mode.
2. Refresh page.
3. Verify Light mode persists immediately without flicker.

### Scenario 3: Responsive CRUD
1. Resize to iPhone width.
2. Add a todo.
3. Verify success toast appears centered.
4. Delete a todo.
5. Verify modal is centered and appropriately sized.
