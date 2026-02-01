# Data Model: Phase II UI/UX Enhancement

**Feature**: `005-dark-theme-dashboard` | **Date**: 2026-01-03

## 1. UI State Model (Client-side)

The `UIState` manages the visual representation and navigation context of the dashboard.

| Property | Type | Description | Persistence |
| :--- | :--- | :--- | :--- |
| `theme` | `'light' \| 'dark' \| 'system'` | Current color mode | `localStorage` |
| `sidebarCollapsed` | `boolean` | State of the navigation sidebar | `sessionStorage` |
| `activeNavId` | `string` | ID of the current active navigation item | URL Path |
| `isMounted` | `boolean` | Hydration guard to prevent FOUC/mismatch | Memory |

## 2. Navigation Entity

Defines the structure for the persistent sidebar navigation.

```typescript
interface NavItem {
  id: string; // e.g., 'dashboard', 'tasks'
  label: string;
  icon: string; // Lucide icon component name
  href: string;
  active: boolean;
}
```

## 3. Component Hierarchy & State Distribution

- **`RootLayout`**:
  - Manages `ThemeProvider` context.
  - Injects blocking FOUC script.
- **`DashboardLayout`**:
  - `Sidebar` (Static/Responsive): Tracks `activeNavId`.
  - `Header`: Displays `User` info and `Search` state.
  - `MainContent`: Scrollable area for feature pages.
- **`TodoItem` (Visual Update)**:
  - Consumes `Task` entity but applies new minimalist styles.

## 4. Color Tokens (Tailwind v4 Variables)

Mapped to the high-fidelity palette in `globals.css`:

- `--background`: `#000000` (OLED Black)
- `--surface`: `#1A1A1A` (Deep Gray/Card)
- `--foreground`: `#EDEDED` (Off-white Text)
- `--muted`: `#71717A` (Subtle metadata)
- `--border`: `rgba(255, 255, 255, 0.1)` (Glass border)
