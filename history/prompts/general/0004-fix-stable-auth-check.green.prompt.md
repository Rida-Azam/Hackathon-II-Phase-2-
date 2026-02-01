---
id: 0004
title: Fix stable auth check in login page
stage: green
date: 2026-01-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-todo-web-app
user: Rida
command: fix stable auth check
labels: ["nextjs", "react-hooks", "auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/login/page.tsx
tests:
  - none
---

## Prompt

I have a React/Next.js error in my app (Phase II Todo project):

Error message:
"The final argument passed to useEffect changed size between renders. The order and size of this array must remain constant.
Previous: []
Incoming: [[object Object]]
    at LoginPage (src/app/login/page.tsx:14:12)"

Code snippet from src/app/login/page.tsx:
useEffect(() => {
  const token = localStorage.getItem("auth_token");
  console.log("[Debug] Login Page Mount - Token exists:", !!token);
  if (token) {
    router.push("/todos");
  }
}, [router]);  // ← this is line ~14, and the dependency array is the problem

## Response snapshot

I simplified and stabilized the `useEffect` hook in the Login and Signup pages by ensuring `router` is consistently included in the dependency array and that the component handles the loading state (waiting for auth check) explicitly.

## Outcome

- ✅ Impact: Resolved the persistent React hook mismatch error and prevented flashing of auth forms before redirection.
- 🧪 Tests: none
- 📁 Files: modified frontend/src/app/login/page.tsx
- 🔁 Next prompts: none
- 🧠 Reflection: Next.js dev server state can become inconsistent when hooks are modified. A clean `useEffect` that follows dependency rules, combined with a manual dev server restart, is the most robust way to clear these "changed size" errors.

## Evaluation notes (flywheel)

- Failure modes observed: Simple code edits didn't clear the error until the hook sequence was made deterministic and dev-server-friendly.
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
