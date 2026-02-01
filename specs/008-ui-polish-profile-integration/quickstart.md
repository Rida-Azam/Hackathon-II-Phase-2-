# Quick Start Guide: Phase II UI Polish & Profile Integration

**Feature**: `008-ui-polish-profile-integration`
**Branch**: `008-ui-polish-profile-integration`
**Date**: 2026-01-05

## Overview

This guide helps developers implement the UI polish and profile integration feature for the Todo application Phase II.

## Prerequisites

- Node.js 18+ installed
- Frontend and backend servers running
- Existing authentication working (login/signup functional)
- Current branch: `008-ui-polish-profile-integration`

## Development Setup

### 1. Verify Branch

```bash
git branch --show-current
# Should output: 008-ui-polish-profile-integration
```

### 2. Start Development Servers

**Backend** (in one terminal):
```bash
cd backend
uvicorn src.main:app --reload
```

**Frontend** (in another terminal):
```bash
cd frontend
npm run dev
```

### 3. Verify Current State

Navigate to http://localhost:3000 and verify:
- ✅ Login works
- ✅ Signup works
- ✅ /todos page loads
- ✅ Can add tasks
- ✅ Can toggle task completion
- ✅ Dark theme applied

## Implementation Checklist

### Phase 1: Create Auth Utility

**File**: `frontend/src/types/auth.ts` (NEW)

```typescript
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
```

**File**: `frontend/src/lib/auth.ts` (NEW)

```typescript
import { UserProfile } from '@/types/auth';

export function getUserFromSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;

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

export function logout(): void {
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.location.href = '/login';
}
```

**Test**: Import and call `getUserFromSession()` in browser console

### Phase 2: Update Sidebar Component

**File**: `frontend/src/components/Sidebar.tsx` (MODIFY)

**Changes**:
1. Add import for auth utility
2. Add state for userName
3. Use useEffect to fetch user name on mount
4. Wrap logo in Link to homepage
5. Update navigation items hrefs
6. Replace hardcoded "Soetly" with userName state

**Key Modifications**:
```typescript
import { getUserFromSession } from '@/lib/auth';

// Add state
const [userName, setUserName] = useState('User');

// Add effect
useEffect(() => {
  const user = getUserFromSession();
  if (user?.name) {
    setUserName(user.name);
  }
}, []);

// Update logo (line 44-50)
<Link href="/" className="block">
  <h1 className="text-xl font-bold...">
    {/* existing icon + text */}
  </h1>
</Link>

// Update navItems (line 9-16)
const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/todos", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", href: "/todos", icon: CheckSquare },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: Calendar },
  { id: "reminders", label: "Reminders", href: "/reminders", icon: Bell },
  { id: "notes", label: "Notes", href: "/notes", icon: FileText },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];

// Update profile name (line 84)
<p className="text-xs font-bold text-foreground">{userName}</p>
```

**Test**:
- Click logo → Should navigate to homepage
- Check sidebar → Should show "User" in profile section
- Click any nav item → Should update active highlight

### Phase 3: Update Header Component

**File**: `frontend/src/components/Header.tsx` (MODIFY)

**Changes**:
1. Add import for auth utility
2. Add state for userName
3. Use useEffect to fetch user name on mount
4. Replace hardcoded "Soetly" with userName state

**Key Modifications**:
```typescript
import { getUserFromSession } from '@/lib/auth';

// Add state
const [userName, setUserName] = useState('User');

// Add effect
useEffect(() => {
  const user = getUserFromSession();
  if (user?.name) {
    setUserName(user.name);
  }
}, []);

// Update name display (line 25)
<p className="text-sm font-bold text-foreground font-poppins">{userName}</p>
```

**Test**:
- Check header → Should show "User" in profile section

### Phase 4: Create Placeholder Pages

**Files**: Create 3 new files

**Template** (use for all three):
```typescript
"use client";

import Link from "next/link";

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

**Create**:
1. `frontend/src/app/calendar/page.tsx` - Replace [Feature] with "Calendar"
2. `frontend/src/app/reminders/page.tsx` - Replace [Feature] with "Reminders"
3. `frontend/src/app/notes/page.tsx` - Replace [Feature] with "Notes"

**Test**:
- Click Calendar in sidebar → Should show placeholder
- Click Reminders → Should show placeholder
- Click Notes → Should show placeholder
- Click "Back to Dashboard" → Should return to /todos

### Phase 5: Create Settings Page

**File**: `frontend/src/app/settings/page.tsx` (NEW)

```typescript
"use client";

import { useState, useEffect } from "react";
import { getUserFromSession } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { UserProfile } from "@/types/auth";

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile>({
    name: 'User',
    email: 'user@example.com',
    avatar: null
  });

  useEffect(() => {
    const userData = getUserFromSession();
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground font-poppins mb-8">
              Settings
            </h1>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-bold text-foreground font-poppins mb-6">
                Profile Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {user.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Status
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    Active Now
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Membership
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    Pro Member
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
```

**Test**:
- Click Settings in sidebar → Should show settings page
- Verify user data displays (name, email, status, membership)
- Verify layout matches /todos page (Sidebar + Header)

### Phase 6: Verify Logout Functionality

**File**: `frontend/src/app/todos/page.tsx` (REVIEW ONLY)

**Find the `handleLogout` function** and verify it:
1. Clears localStorage.auth_token
2. Clears cookie auth_token
3. Redirects to /login

**Expected implementation**:
```typescript
const handleLogout = () => {
  localStorage.removeItem("auth_token");
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  window.location.href = "/login";
};
```

**If missing or incomplete**, update it to match the above.

**Test**:
- Click Sign Out button → Should clear session and redirect to login
- Try navigating to /todos → Should redirect to login (session cleared)
- Login again → Should work normally

## Testing Checklist

Run through this checklist after completing all phases:

### Navigation Testing
- [ ] Click "Todo" logo → Navigates to homepage
- [ ] Click "Dashboard" → Stays on /todos or refreshes
- [ ] Click "Tasks" → Navigates to /todos
- [ ] Click "Calendar" → Shows placeholder page
- [ ] Click "Reminders" → Shows placeholder page
- [ ] Click "Notes" → Shows placeholder page
- [ ] Click "Settings" → Shows settings page with user info

### Profile Integration Testing
- [ ] Sidebar shows user name (not hardcoded "Soetly")
- [ ] Header shows user name (not hardcoded "Soetly")
- [ ] Settings page shows user email
- [ ] Settings page shows status "Active Now"
- [ ] Settings page shows "Pro Member" badge

### Logout Testing
- [ ] Click Sign Out → Clears localStorage
- [ ] Sign Out → Clears cookies
- [ ] Sign Out → Redirects to /login
- [ ] After logout, try accessing /todos → Redirects to login
- [ ] Login after logout → Works normally

### Mobile Testing
- [ ] Resize browser to mobile size
- [ ] Hamburger menu appears
- [ ] Click hamburger → Sidebar opens
- [ ] Click nav item → Navigates AND closes sidebar
- [ ] Click backdrop → Closes sidebar

### Theme Consistency Testing
- [ ] All new pages match dark theme
- [ ] Placeholder pages use correct colors
- [ ] Settings page uses correct colors
- [ ] No visual breaks or inconsistencies

### Regression Testing
- [ ] Can still add tasks
- [ ] Can still toggle task completion
- [ ] Can still delete tasks
- [ ] Login still works
- [ ] Signup still works
- [ ] Theme toggle still works

## Common Issues & Solutions

### Issue: "User" doesn't change to actual name
**Solution**: Check that `getUserFromSession()` is being called in useEffect and the return value is used to set state.

### Issue: Navigation doesn't work
**Solution**: Verify all nav items use correct `href` prop with proper paths (/calendar, /reminders, etc.)

### Issue: Mobile menu doesn't close after navigation
**Solution**: Ensure `onClick={() => setIsOpen(false)}` is on the Link component in Sidebar

### Issue: Logout doesn't clear session
**Solution**: Verify BOTH localStorage and cookies are cleared in handleLogout function

### Issue: Placeholder pages don't show
**Solution**: Verify page.tsx files are in correct directories: app/calendar/page.tsx, etc.

## Performance Notes

- Navigation is client-side (instant)
- Profile data loaded once on component mount (no repeated calls)
- No API calls for UI-only changes
- Lazy-loaded routes (Next.js automatic)

## Security Notes

- Never log full token values in console
- Always clear both localStorage AND cookies on logout
- Verify middleware protects new routes (automatic with existing setup)

## Next Steps

After completing implementation:
1. Run full testing checklist
2. Verify no console errors
3. Test on multiple browsers (Chrome, Firefox, Safari)
4. Test mobile responsiveness
5. Commit changes following git workflow
6. Create pull request with feature description

## Documentation

**Reference Documents**:
- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Research Findings](./research.md)
- [Data Model](./data-model.md)
- [Navigation Contracts](./contracts/navigation-flow.md)

## Support

For issues or questions:
- Review constitution.md for governance rules
- Check CLAUDE.md for AI agent guidelines
- Refer to existing components for styling patterns
- Test incrementally (one phase at a time)

---

**Estimated Implementation Time**: 2-3 hours
**Complexity**: Low (UI integration only, no backend changes)
**Risk Level**: Low (no breaking changes, additive feature)
