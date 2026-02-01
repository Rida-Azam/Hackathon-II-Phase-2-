---
id: 0002
title: Fix useEffect dependency array mismatch
stage: red
date: 2026-01-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-todo-web-app
user: Rida
command: fix useEffect error
labels: ["react", "hooks", "nextjs", "debugging"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/login/page.tsx
  - frontend/src/app/signup/page.tsx
tests:
  - none
---

## Prompt

The final argument passed to useEffect changed size between renders. The order and size of this array must remain constant.

Previous: []
Incoming: [[object Object]]

    at LoginPage (src/app/login/page.tsx:14:12)

## Response snapshot

I have fixed the `useEffect` error by reverting the dependency array to `[]` in both `login/page.tsx` and `signup/page.tsx`. This avoids the "array changed size" error that occurs during React Fast Refresh or Turbopack reloads when dependencies are added/removed.

## Outcome

- ✅ Impact: Resolved a runtime console error that prevented the Auth pages from loading correctly during development.
- 🧪 Tests: none
- 📁 Files: modified frontend/src/app/login/page.tsx, frontend/src/app/signup/page.tsx
- 🔁 Next prompts: none
- 🧠 Reflection: While it's standard practice to include all dependencies, stable objects from hooks (like router) can be safely excluded if they cause hydration or Hot Module Replacement (HMR) issues in specific environments like Turbopack.

## Evaluation notes (flywheel)

- Failure modes observed: Dependency array size change triggered a hard React error.
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
