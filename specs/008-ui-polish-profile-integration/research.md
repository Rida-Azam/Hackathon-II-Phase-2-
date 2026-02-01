# Research: Phase II UI Polish & Profile Integration

**Feature**: `008-ui-polish-profile-integration`
**Date**: 2026-01-05
**Purpose**: Research best practices and implementation patterns for frontend UI integration

## Research Questions

### 1. How to retrieve user information from Better Auth session?

**Decision**: Use localStorage token parsing or create a small auth utility

**Rationale**:
- Current implementation stores mock JWT token in localStorage: `"fake-jwt-token-for-demo"`
- Better Auth is installed but not yet configured for real JWT decoding
- For Phase II, we can extract user info from login/signup flow or use localStorage mock data
- Real JWT decoding can be added in future phases

**Implementation Pattern**:
```typescript
// lib/auth.ts
export function getUserFromSession() {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  // For Phase II: Return mock user data
  // In production, decode JWT or call Better Auth API
  return {
    name: 'User', // Fallback
    email: 'user@example.com',
    avatar: null
  };
}
```

**Alternatives Considered**:
- Full Better Auth session integration - Rejected: Over-engineering for Phase II, authentication already works with mock tokens
- Call backend API for user info - Rejected: No backend changes allowed per spec
- Store user data separately in localStorage during login - Selected: Simple, works with current mock auth

### 2. How to handle navigation in Next.js App Router for sidebar menu items?

**Decision**: Use Next.js `<Link>` component for valid routes, `#` hrefs for placeholders

**Rationale**:
- Next.js Link component provides client-side navigation (instant)
- Current sidebar already uses Link with `href="#"` for unimplemented pages
- Simply change hrefs to proper route paths: `/calendar`, `/reminders`, `/notes`, `/settings`
- For Dashboard and Tasks, use `/todos` (existing page)

**Implementation Pattern**:
```typescript
const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/todos", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", href: "/todos", icon: CheckSquare },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: Calendar },
  { id: "reminders", label: "Reminders", href: "/reminders", icon: Bell },
  { id: "notes", label: "Notes", href: "/notes", icon: FileText },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];
```

**Alternatives Considered**:
- Use JavaScript onClick handlers with router.push() - Rejected: Link component is more idiomatic and handles prefetching
- Implement full routing logic in sidebar - Rejected: Unnecessary complexity, Link handles this

### 3. How to make the "Todo" logo clickable and navigate to homepage?

**Decision**: Wrap logo in Next.js `<Link href="/">`

**Rationale**:
- Standard web convention: logo → homepage
- Next.js Link component provides proper navigation
- Current logo in Sidebar.tsx (line 45-50) is just static markup
- Simple wrap with Link component

**Implementation Pattern**:
```typescript
<Link href="/" className="block">
  <h1 className="text-xl font-bold font-poppins text-foreground tracking-tight flex items-center">
    <div className="w-6 h-6 bg-foreground rounded-lg mr-3 flex items-center justify-center">
      <div className="w-2 h-2 bg-background rounded-full" />
    </div>
    Todo
  </h1>
</Link>
```

**Alternatives Considered**:
- Add onClick handler to navigate programmatically - Rejected: Link component is cleaner and handles accessibility
- Create separate logo component - Rejected: Unnecessary abstraction for single use

### 4. How to integrate user name into profile sections (Sidebar and Header)?

**Decision**: Create auth utility, use React hook to fetch user data on component mount

**Rationale**:
- Current profile sections have hardcoded name "Soetly"
- Need dynamic user data from authentication session
- Use useEffect + useState to load user data once on mount
- Fallback to "User" if no name available

**Implementation Pattern**:
```typescript
// In Sidebar.tsx and Header.tsx
const [userName, setUserName] = useState('User');

useEffect(() => {
  const user = getUserFromSession();
  if (user?.name) {
    setUserName(user.name);
  }
}, []);

// Then render:
<p className="text-xs font-bold text-foreground">{userName}</p>
```

**Alternatives Considered**:
- Use React Context for global user state - Rejected: Over-engineering for simple profile display
- Call API on every render - Rejected: Unnecessary network calls, data already in localStorage
- Use Better Auth React hooks - Rejected: Not yet configured, would require additional setup

### 5. What should placeholder pages (Calendar, Reminders, Notes) look like?

**Decision**: Create simple centered page with "Coming Soon" message matching dark theme

**Rationale**:
- Spec requires placeholder pages with "Coming soon" messaging
- Must maintain black/dark theme consistency
- Should match existing UI aesthetic (rounded corners, subtle borders)
- Include option to return to todos

**Implementation Pattern**:
```typescript
export default function CalendarPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/10 max-w-md">
        <h1 className="text-3xl font-bold text-foreground font-poppins mb-4">
          Calendar
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

**Alternatives Considered**:
- Empty page with just text - Rejected: Doesn't match polished UI aesthetic
- Full layout with sidebar - Rejected: Spec indicates simple placeholder, don't over-engineer
- Toast notification instead of page - Rejected: User needs feedback that they clicked something

### 6. What should Settings page display?

**Decision**: Simple page showing user profile information (name, email, status)

**Rationale**:
- Spec requires settings page with "user profile information"
- Not meant to be editable in Phase II (per Non-Goals)
- Display read-only user data in styled card
- Can add edit functionality in future phases

**Implementation Pattern**:
```typescript
export default function SettingsPage() {
  const [user, setUser] = useState({ name: 'User', email: '' });

  useEffect(() => {
    const userData = getUserFromSession();
    if (userData) setUser(userData);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Status</label>
            <p className="text-lg font-semibold">Active Now</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Alternatives Considered**:
- Complex settings with tabs and sections - Rejected: Over-engineering, spec says "simple page with user info"
- Editable form fields - Rejected: Explicitly out of scope per spec Non-Goals

### 7. How to verify sign-out functionality?

**Decision**: Review existing logout handler, ensure it clears both localStorage and cookies

**Rationale**:
- Sign-out button exists in todos/page.tsx (handleLogout function)
- Need to verify it clears auth_token from BOTH localStorage AND cookies
- Should redirect to /login after clearing session
- Current implementation might only clear one or the other

**Implementation Pattern**:
```typescript
const handleLogout = () => {
  // Clear localStorage
  localStorage.removeItem("auth_token");

  // Clear cookie
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

  // Redirect to login
  window.location.href = "/login";
};
```

**Alternatives Considered**:
- Use router.push for redirect - Rejected: Full page reload ensures all state is cleared
- Call Better Auth logout API - Rejected: No backend changes allowed

## Best Practices Applied

### Next.js App Router Navigation
- Use `<Link>` components for all navigation (client-side, fast)
- Use `usePathname()` hook to highlight active nav items (already implemented in Sidebar)
- Leverage middleware for route protection (already exists)

### React State Management
- Use local component state (useState) for simple UI state
- Use useEffect for data fetching on component mount
- Keep profile data in lightweight utility function, no global state needed

### TypeScript Safety
- Define user type interface for auth utility return value
- Use proper typing for component props
- Maintain existing type definitions

### Dark Theme Consistency
- Use existing Tailwind classes: bg-background, text-foreground, bg-white/5, border-white/10
- Maintain rounded-3xl, rounded-2xl border radius patterns
- Use existing color variables from theme system

### Performance
- No unnecessary re-renders (user data fetched once on mount)
- Navigation is client-side (instant)
- No API calls for UI-only changes

## Conclusion

All research questions resolved. No clarifications needed. Ready to proceed to Phase 1 (Design & Contracts).

**Key Implementation Files**:
1. `frontend/src/lib/auth.ts` - New auth utility
2. `frontend/src/components/Sidebar.tsx` - Update navigation + profile
3. `frontend/src/components/Header.tsx` - Update logo + profile
4. `frontend/src/app/calendar/page.tsx` - New placeholder
5. `frontend/src/app/reminders/page.tsx` - New placeholder
6. `frontend/src/app/notes/page.tsx` - New placeholder
7. `frontend/src/app/settings/page.tsx` - New settings page
8. `frontend/src/app/todos/page.tsx` - Verify logout handler

**No backend changes required. No new dependencies required. All existing packages support requirements.**
