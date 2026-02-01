# Data Model: Phase II UI Polish & Profile Integration

**Feature**: `008-ui-polish-profile-integration`
**Date**: 2026-01-05
**Purpose**: Define component state models and data structures for UI integration

## Overview

This feature is primarily UI integration with no new backend entities. The data models represent client-side React component state and browser storage structures.

## Entities

### User Session (Browser Storage)

Represents the authenticated user's session data stored in browser localStorage and cookies.

**Storage Location**: `localStorage.auth_token` and `document.cookie.auth_token`

**Structure**:
```typescript
interface SessionData {
  token: string;        // JWT token (currently mock: "fake-jwt-token-for-demo")
  expiresAt?: number;   // Optional token expiration timestamp
}
```

**Notes**:
- Currently uses mock token for Phase II
- Real JWT decoding to be implemented in future phases
- Same token stored in both localStorage and cookies for middleware compatibility

### User Profile (Derived Data)

Represents user profile information displayed in UI components (Sidebar, Header, Settings).

**Source**: Derived from session token or mock data (Phase II)

**Structure**:
```typescript
interface UserProfile {
  name: string;          // User's display name
  email: string;         // User's email address
  avatar?: string | null; // Optional avatar URL (currently unused)
}
```

**Validation Rules**:
- `name`: Required, defaults to "User" if not available
- `email`: Required, defaults to "user@example.com" if not available
- `avatar`: Optional, defaults to null (shows icon placeholder)

**State Transitions**:
```
[Not Authenticated] → Login → [Session Created] → [Profile Data Available]
[Profile Data Available] → Logout → [Session Cleared] → [Not Authenticated]
```

### Navigation State (Component State)

Represents the current navigation state in the Sidebar component.

**Structure**:
```typescript
interface NavigationState {
  currentPath: string;    // Current URL pathname (from usePathname hook)
  isOpen: boolean;        // Mobile sidebar open/closed state
}
```

**Validation Rules**:
- `currentPath`: Automatically synced with Next.js router
- `isOpen`: Boolean toggle for mobile menu

**State Transitions**:
```
[Closed] → User clicks hamburger → [Open]
[Open] → User clicks nav item / backdrop → [Closed]
[Any Path] → User navigates → [New Path + Active indicator updates]
```

### Navigation Item (Static Configuration)

Represents a single menu item in the sidebar navigation.

**Structure**:
```typescript
interface NavItem {
  id: string;           // Unique identifier (e.g., "dashboard", "calendar")
  label: string;        // Display label (e.g., "Dashboard", "Calendar")
  href: string;         // Navigation URL (e.g., "/todos", "/calendar")
  icon: LucideIcon;     // Icon component from lucide-react
}
```

**Example Data**:
```typescript
const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/todos", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", href: "/todos", icon: CheckSquare },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: Calendar },
  { id: "reminders", label: "Reminders", href: "/reminders", icon: Bell },
  { id: "notes", label: "Notes", href: "/notes", icon: FileText },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];
```

## Component State Models

### Sidebar Component State

```typescript
// Sidebar.tsx internal state
interface SidebarState {
  isOpen: boolean;          // Mobile menu open/closed
  userName: string;         // Display name for profile section
  currentPath: string;      // Current route (for active highlighting)
}
```

**Initialization**:
- `isOpen`: false (mobile menu closed by default)
- `userName`: "User" (default, updated on mount from getUserFromSession)
- `currentPath`: From `usePathname()` hook

**Updates**:
- `isOpen`: Toggled on hamburger button click or nav item click
- `userName`: Set once on component mount via useEffect
- `currentPath`: Auto-updated by Next.js router

### Header Component State

```typescript
// Header.tsx internal state
interface HeaderState {
  userName: string;         // Display name for profile section
}
```

**Initialization**:
- `userName`: "User" (default, updated on mount from getUserFromSession)

**Updates**:
- `userName`: Set once on component mount via useEffect

### Placeholder Page State

Placeholder pages (Calendar, Reminders, Notes) are stateless functional components. No internal state required.

### Settings Page State

```typescript
// Settings page internal state
interface SettingsPageState {
  user: UserProfile;        // User profile data
}
```

**Initialization**:
- `user`: { name: "User", email: "user@example.com", avatar: null }

**Updates**:
- `user`: Set once on component mount via useEffect calling getUserFromSession

## Data Flow

### Authentication Flow

```
[Login/Signup]
  → Store token in localStorage + cookie
  → Navigate to /todos
  → Components mount
  → getUserFromSession() called
  → Profile data displayed in Sidebar + Header
```

### Navigation Flow

```
[User clicks sidebar item]
  → Next.js <Link> component handles navigation
  → URL updates
  → usePathname() hook in Sidebar detects change
  → Active nav item highlighting updates
  → Mobile menu closes (if open)
```

### Logout Flow

```
[User clicks Sign Out]
  → handleLogout() called
  → Clear localStorage.auth_token
  → Clear cookie auth_token
  → window.location.href = "/login"
  → Full page reload (clears all React state)
```

## Storage Schema

### LocalStorage Keys

```typescript
{
  "auth_token": string,      // JWT token (mock for Phase II)
  "theme": string            // Existing theme preference (not modified)
}
```

### Cookie Schema

```
auth_token=<token-value>; path=/; max-age=3600; SameSite=Lax
```

## Type Definitions

All types should be defined in a new file: `frontend/src/types/auth.ts`

```typescript
// frontend/src/types/auth.ts

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string | null;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface SessionData {
  token: string;
  expiresAt?: number;
}
```

## Validation & Error Handling

### Session Validation

```typescript
// In lib/auth.ts
export function getUserFromSession(): UserProfile | null {
  if (typeof window === 'undefined') return null; // SSR safety

  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  // Phase II: Mock user data
  // TODO: Decode JWT in future phases
  return {
    name: 'User',
    email: 'user@example.com',
    avatar: null
  };
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}
```

### Component Error Boundaries

No new error boundaries needed. Existing Next.js error handling sufficient for this feature.

### Fallback Behavior

| Scenario | Fallback Behavior |
|----------|-------------------|
| No user name in session | Display "User" |
| No email in session | Display "user@example.com" |
| No avatar | Display User icon from Lucide |
| Session expired | Redirect to /login (existing middleware) |
| Navigation error | Next.js 404 page (existing) |

## Summary

This feature introduces no new backend entities. All data models are client-side React component state or browser storage. The simplicity aligns with the specification goal of "only make existing UI elements functional" without adding new features.

**Key Files for Type Definitions**:
- `frontend/src/types/auth.ts` - New file for auth-related types
- `frontend/src/lib/auth.ts` - New file for auth utility functions
- Existing `frontend/src/types/todo.ts` - No changes needed
