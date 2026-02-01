# Navigation Flow Contract: Phase II UI Polish & Profile Integration

**Feature**: `008-ui-polish-profile-integration`
**Date**: 2026-01-05
**Purpose**: Define navigation routes, component interactions, and user flow contracts

## Route Definitions

### Existing Routes (No Changes)

| Route | Page Component | Auth Required | Description |
|-------|---------------|---------------|-------------|
| `/` | `app/page.tsx` | No | Landing page with feature cards |
| `/login` | `app/login/page.tsx` | No (redirect if authenticated) | Login form |
| `/signup` | `app/signup/page.tsx` | No (redirect if authenticated) | Signup form |
| `/todos` | `app/todos/page.tsx` | Yes | Main dashboard with task list |

### New Routes (This Feature)

| Route | Page Component | Auth Required | Description |
|-------|---------------|---------------|-------------|
| `/calendar` | `app/calendar/page.tsx` | Yes | Placeholder for calendar feature |
| `/reminders` | `app/reminders/page.tsx` | Yes | Placeholder for reminders feature |
| `/notes` | `app/notes/page.tsx` | Yes | Placeholder for notes feature |
| `/settings` | `app/settings/page.tsx` | Yes | User settings and profile info |

## Component Contracts

### Sidebar Component (`components/Sidebar.tsx`)

**Props**: None (self-contained)

**Internal State**:
```typescript
{
  isOpen: boolean;      // Mobile menu state
  userName: string;     // User display name
}
```

**Responsibilities**:
1. Render navigation menu with 6 items (Dashboard, Tasks, Calendar, Reminders, Notes, Settings)
2. Highlight active navigation item based on current route
3. Display user profile section with name, avatar, and badges
4. Handle mobile menu open/close
5. Wrap "Todo" logo in Link to homepage
6. Fetch and display user name from session on mount

**Navigation Behavior**:
- All nav items use Next.js `<Link>` component
- Clicking nav item triggers client-side navigation
- Mobile menu auto-closes after navigation
- Active item determined by pathname matching href

**Integration Points**:
- `usePathname()` from Next.js for route detection
- `getUserFromSession()` from `lib/auth.ts` for user data
- `Link` from Next.js for navigation

### Header Component (`components/Header.tsx`)

**Props**: None (self-contained)

**Internal State**:
```typescript
{
  userName: string;     // User display name
}
```

**Responsibilities**:
1. Display search bar (non-functional placeholder for Phase II)
2. Display theme toggle button
3. Display user profile section with name and avatar
4. No navigation logic (only display)

**Integration Points**:
- `getUserFromSession()` from `lib/auth.ts` for user data
- `ThemeToggle` component (existing, no changes)

### Auth Utility (`lib/auth.ts`)

**Exports**:

```typescript
// Get user profile from session
export function getUserFromSession(): UserProfile | null

// Check if user is authenticated
export function isAuthenticated(): boolean

// Clear session and logout
export function logout(): void
```

**Function Contracts**:

#### `getUserFromSession()`
- **Input**: None
- **Output**: `UserProfile | null`
- **Behavior**:
  - Returns null if window is undefined (SSR safety)
  - Returns null if no auth_token in localStorage
  - Returns UserProfile with mock data for Phase II
  - Future: Will decode JWT and return real user data
- **Side Effects**: None

#### `isAuthenticated()`
- **Input**: None
- **Output**: `boolean`
- **Behavior**:
  - Returns false if window is undefined (SSR safety)
  - Returns true if auth_token exists in localStorage
  - Returns false otherwise
- **Side Effects**: None

#### `logout()`
- **Input**: None
- **Output**: `void`
- **Behavior**:
  - Clears auth_token from localStorage
  - Clears auth_token cookie
  - Redirects to /login with full page reload
- **Side Effects**:
  - Modifies localStorage
  - Modifies document.cookie
  - Triggers navigation

### Placeholder Pages (Calendar, Reminders, Notes)

**Props**: None (self-contained)

**State**: Stateless

**Responsibilities**:
1. Display centered "Coming Soon" message
2. Provide "Back to Dashboard" link
3. Match dark theme styling

**Template Contract**:
```typescript
export default function [Feature]Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/10 max-w-md">
        <h1 className="text-3xl font-bold text-foreground font-poppins mb-4">
          [Feature Name]
        </h1>
        <p className="text-muted-foreground mb-8">
          This feature is coming soon. Stay tuned for updates!
        </p>
        <Link
          href="/todos"
          className="inline-block px-6 py-3 bg-foreground text-background rounded-2xl font-bold hover:opacity-90 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
```

### Settings Page (`app/settings/page.tsx`)

**Props**: None (self-contained)

**Internal State**:
```typescript
{
  user: UserProfile;    // User profile data
}
```

**Responsibilities**:
1. Display user profile information (name, email, status)
2. Fetch user data from session on mount
3. Display read-only information (no editing in Phase II)
4. Match dark theme styling
5. Use same layout as todos page (with Sidebar + Header)

**Integration Points**:
- `getUserFromSession()` from `lib/auth.ts` for user data
- `Sidebar` and `Header` components for consistent layout

## Navigation User Flows

### Flow 1: Navigate via Sidebar

```
[User on /todos page]
  ↓
[User clicks "Calendar" in sidebar]
  ↓
[Next.js Link triggers navigation]
  ↓
[URL changes to /calendar]
  ↓
[Calendar placeholder page renders]
  ↓
[Sidebar shows "Calendar" as active]
  ↓
[Mobile menu closes (if applicable)]
```

### Flow 2: Logo Click to Homepage

```
[User on any authenticated page]
  ↓
[User clicks "Todo" logo in sidebar]
  ↓
[Next.js Link triggers navigation]
  ↓
[URL changes to /]
  ↓
[Landing page renders]
  ↓
[Landing page detects auth token]
  ↓
[User redirected back to /todos]
```

**Note**: Landing page has existing logic to redirect authenticated users to /todos

### Flow 3: Settings Page Access

```
[User on /todos page]
  ↓
[User clicks "Settings" in sidebar]
  ↓
[URL changes to /settings]
  ↓
[Settings page renders with Sidebar + Header]
  ↓
[User profile data fetched from session]
  ↓
[Name, email, status displayed]
```

### Flow 4: Logout

```
[User on any authenticated page]
  ↓
[User clicks "Sign Out" button (in Header or todos page)]
  ↓
[logout() function called]
  ↓
[localStorage.auth_token cleared]
  ↓
[Cookie auth_token cleared]
  ↓
[window.location.href = "/login"]
  ↓
[Full page reload to /login]
  ↓
[Login page renders]
```

## Middleware Contracts

### Existing Middleware Behavior (No Changes)

**File**: `frontend/middleware.ts`

**Protected Routes**:
- `/todos/*` - Requires auth cookie
- Other authenticated routes will automatically be protected

**Auth Routes**:
- `/login` - Redirects to /todos if auth cookie present
- `/signup` - Redirects to /todos if auth cookie present

**Behavior for New Routes**:
- `/calendar`, `/reminders`, `/notes`, `/settings` will be protected by existing middleware pattern
- No middleware changes needed (middleware already protects all non-public routes)

## Error Handling Contracts

### Navigation Errors

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| User navigates to non-existent route | Next.js built-in 404 page |
| User tries to access protected route without auth | Middleware redirects to /login |
| Auth token expires mid-session | API interceptor catches 401, redirects to /login |
| Network error during navigation | Next.js error boundary shows error page |

### Profile Data Errors

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| getUserFromSession() returns null | Display "User" as fallback name |
| No email in session | Display "user@example.com" as fallback |
| No avatar | Display User icon from Lucide |

## Accessibility Contracts

### Keyboard Navigation
- All nav items must be keyboard accessible (Link component provides this)
- Tab order: Logo → Nav items → Profile section

### Screen Readers
- Nav items must have proper aria labels (Link text provides this)
- Active nav item must announce as "current page"
- Mobile menu toggle must announce state (open/closed)

### Focus Management
- Focus should move to main content after navigation
- Mobile menu should trap focus when open
- Closing mobile menu should return focus to toggle button

## Performance Contracts

### Navigation Speed
- Client-side navigation must complete in <100ms
- Profile data fetch must complete in <1000ms
- No layout shift during profile name load

### Code Splitting
- Placeholder pages should be lazy-loaded (Next.js automatic)
- Settings page should be lazy-loaded (Next.js automatic)
- No impact on initial bundle size

## Security Contracts

### Token Handling
- Never expose full token in console logs
- Always clear both localStorage AND cookies on logout
- Use HttpOnly cookies in future phases (requires backend change)

### Route Protection
- All new routes must be protected by existing middleware
- No sensitive data in URL parameters
- No user data in client-side JavaScript globals

## Testing Contracts

### Manual Testing Checklist

For each navigation item:
1. Click nav item → Verify correct page loads
2. Check URL → Verify correct path
3. Check sidebar → Verify active item highlighted
4. Check mobile → Verify menu closes after navigation

For profile integration:
1. Login → Verify name displays in sidebar
2. Login → Verify name displays in header
3. Check settings page → Verify user data displays
4. Logout → Verify session clears completely

For placeholders:
1. Click Calendar → Verify placeholder message
2. Click Reminders → Verify placeholder message
3. Click Notes → Verify placeholder message
4. Click "Back to Dashboard" → Verify returns to /todos

## Summary

All navigation and component contracts defined. No backend API contracts needed (frontend-only feature). All routes protected by existing middleware. All components follow existing React/Next.js patterns.

**Key Integration Points**:
- Next.js App Router for navigation
- `usePathname()` for active route detection
- `lib/auth.ts` for session management
- Existing middleware for route protection
- Existing dark theme variables for styling
