---
id: 0001
title: Fix redirect loops in auth pages
stage: green
date: 2026-01-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-todo-web-app
user: Rida
command: fix redirect issues
labels: ["auth", "middleware", "redirects", "nextjs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/middleware.ts
  - frontend/src/app/signup/page.tsx
  - frontend/src/app/login/page.tsx
tests:
  - none
---

## Prompt

Fix recursive redirect loops and manual login/signup check issues in the Phase II web application.

## Response snapshot

I have updated the `middleware.ts` to handle auth routes and prevent redirect loops by explicitly checking for existing tokens on `/login` and `/signup`. I also updated the `useEffect` hooks in both `login/page.tsx` and `signup/page.tsx` to ensure they non-destructively redirect logged-in users to `/todos` using `router.replace`.

## Outcome

- ✅ Impact: Resolved infinite redirect loops and improved UX for authenticated users visiting auth pages.
- 🧪 Tests: none
- 📁 Files: modified frontend/middleware.ts, signup/page.tsx, login/page.tsx
- 🔁 Next prompts: none
- 🧠 Reflection: Centralizing auth redirects in middleware is cleaner, but keeping a client-side check as a fallback (using router.replace) ensures a smooth SPA experience even if the cookie is just appearing.

## Evaluation notes (flywheel)

- Failure modes observed: Initial redirection logic didn't account for users already on /login or /signup with a token.
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
