# Implementation Plan: Evolution of Todo - Responsive Black Theme

**Branch**: `006-responsive-black-theme` | **Date**: 2026-01-03 | **Spec**: [./spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-responsive-black-theme/spec.md`

**Note**: This plan has been reverse-engineered from the existing implementation on the `006-responsive-black-theme` branch.

## Summary

The objective is to evolve the Todo application into a professional, high-performance full-stack web application with a "pure black" (#000000) minimalist theme. This involves updating the Next.js frontend with modern typography (Inter/Poppins), implementing a responsive layout with a persistent sidebar, and ensuring seamless integration with the FastAPI backend.

## Technical Context

**Language/Version**: Python 3.13+, TypeScript (React 19.2.3 / Next.js 16.1.1)
**Primary Dependencies**: FastAPI (Backend), Next.js 16 (Frontend), Tailwind CSS v4, SQLModel, Lucide React
**Storage**: SQLite (Local Dev), PostgreSQL-ready (SQLModel)
**Testing**: Not implemented in current feature branch
**Target Platform**: Web (Responsive Desktop/Mobile)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Lighthouse score >= 90, TTI < 2s
**Constraints**: Pure black background (#000000), single-page dashboard layout, JWT-based auth simulation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Workflow**: Passed (Spec exists and is well-structured).
- **Agent Boundaries**: Passed (Implementation matches spec requirements).
- **Phase I Tech Policy**: **VIOLATION** (Current implementation is Phase II but constitution only describes Phase I CLI).
  - *Justification*: The project has progressed to Phase II (Web App) as per the implementation, but the core constitution needs an update to reflect the new phase's technology stack.
- **Clean Architecture**: Passed (Clear separation of frontend/backend, models/routes/components).

## Project Structure

### Documentation (this feature)

```text
specs/006-responsive-black-theme/
├── spec.md                     # Feature requirements
├── plan.md                     # This file (reverse-engineered)
├── checklists/requirements.md  # Quality checklist
└── tasks.md                    # To be generated
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/routes/             # API endpoints (todos.py)
│   ├── core/                   # DB connection (db.py)
│   ├── dependencies/           # Auth validation (auth.py)
│   └── models/                 # Data schemas (task.py)
└── alembic/                    # DB Migrations

frontend/
├── src/
│   ├── app/                    # Next.js App Router (todos, login)
│   ├── components/             # Reusable UI (Sidebar, Header, TodoItem)
│   ├── lib/                    # API client (api.ts)
│   ├── types/                  # TypeScript interfaces
│   └── globals.css             # Tailwind 4 & Theme variables
```

**Structure Decision**: Option 2 (Web application with separate frontend/backend) to support multi-tenant/multi-user capabilities and modern web UX.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Next.js + FastAPI | Phase II requirement for modern dashboard | Phase I CLI is too limited for the "responsive black theme" vision |
| Tailwind v4 Inline | Support for advanced CSS variable themes | Tailwind v3 config is more verbose for pure-black color overrides |
