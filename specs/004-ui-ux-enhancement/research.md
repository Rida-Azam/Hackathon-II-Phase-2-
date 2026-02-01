# Research: UI/UX Enhancement

## Key Technical Decisions

### Decision 1: Theme Consistency
**Decision**: Use Tailwind's `dark:` variant combined with a `'dark'` class on the `<html>` element.
**Rationale**:
- Native support in Tailwind CSS.
- Easiest way to toggle the entire application's color scheme.
- High performance (class swap vs. re-rendering theme contexts).
**Alternatives considered**:
- React Context for theme → Rejected (overkill for simple class toggle).
- Styled Components themes → Rejected (project uses Tailwind).

### Decision 2: Font Loading Strategy
**Decision**: Use `next/font/google` for Inter and Poppins.
**Rationale**:
- Built-in Next.js optimization (zero CLS, self-hosting).
- Automatic font subsetting.
- Best performance for premium fonts.
**Alternatives considered**:
- Standard Google Fonts <link> tags → Rejected (less optimized).

### Decision 3: Persistence
**Decision**: Use `localStorage` with a simple JS script in `head` to prevent theme flicker (FOUC).
**Rationale**:
- Persistent survival across sessions.
- Synchronous reading in the browser helps prevent white flash before dark mode is applied.
**Alternatives considered**:
- Cookies → Rejected (not needed for server-side logic).

### Decision 4: Toast / Notifications
**Decision**: Use a simple custom Toast component with Lucide icons.
**Rationale**:
- Minimizes new dependencies (as per constraints).
- Full control over styling to match the new "premium" look.
**Alternatives considered**:
- react-hot-toast → Rejected (adds a dependency).

### Decision 5: Delete Confirmation
**Decision**: Custom Modal component.
**Rationale**:
- Native `confirm()` is not "premium" or "modern" enough for this UX upgrade.
- Fits the glassmorphism requirement.
**Alternatives considered**:
- Native `alert/confirm` → Rejected (poor UX).
