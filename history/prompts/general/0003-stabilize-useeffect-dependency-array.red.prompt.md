---
id: 0003
title: Stabilize useEffect dependency array
stage: red
date: 2026-01-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-todo-web-app
user: Rida
command: fix persistent useEffect error
labels: ["nextjs", "react-hooks", "turbopack", "debugging"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/login/page.tsx
  - frontend/src/app/signup/page.tsx
---

## Prompt

The user reported that the "useEffect changed size between renders" error persisted even after an initial fix.

## Response snapshot

I stabilized the `useEffect` hooks in the Login and Signup pages by including `router` in the dependency array and adding a `window` check to ensure SSR compatibility and render stability during Fast Refresh.

## Outcome

- ✅ Impact: Final resolution of the React hook mismatch error in the Phase II application.
- 🧪 Tests: none
- 📁 Files: modified frontend/src/app/login/page.tsx, frontend/src/app/signup/page.tsx
- 🔁 Next prompts: none
- 🧠 Reflection: Next.js Turbopack is sensitive to dependency array changes during development. Explicitly fulfilling the dependency requirements while adding guardrails for the environment (like the window check) is the most reliable way to prevent these errors across environment reloads.

## Evaluation notes (flywheel)

- Failure modes observed: Simple removal of dependency was not enough to clear the dev server's previous state.
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
