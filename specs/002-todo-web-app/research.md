# Research: Phase II Full-Stack Web Todo Application

**Feature**: Full-Stack Web Todo Application
**Date**: 2025-12-31
**Phase**: Phase II

## Decision: JWT Authentication with Better Auth

**Decision**: Use Better Auth for JWT-based authentication with backend verification.

**Rationale**:
- Better Auth is specified in the Constitution's Phase II technology matrix
- Frontend-first JWT issuance simplifies auth state management
- Backend can verify tokens using JWT secret without additional database calls
- Session management handled automatically by Better Auth

**Alternatives Considered**:
- Custom JWT implementation: Rejected - Better Auth provides battle-tested security
- Session-based auth: Rejected - JWT is more suitable for SPA architectures
- OAuth-only: Rejected - Email/password required per spec

---

## Decision: SQLModel + Alembic for Database

**Decision**: Use SQLModel ORM with Alembic migrations for Neon PostgreSQL.

**Rationale**:
- SQLModel is specified in Constitution's Phase II technology matrix
- Type-safe ORM reduces runtime errors
- Alembic provides version-controlled schema migrations
- SQLModel integrates FastAPI's dependency injection

**Alternatives Considered**:
- Raw SQL with psycopg2: Rejected - Type safety and ORM benefits outweigh complexity
- SQLAlchemy Core: Rejected - SQLModel provides better type integration with Pydantic
- Prisma/Drizzle: Rejected - Python backend requires Python ORM

---

## Decision: Next.js App Router for Frontend

**Decision**: Use Next.js 16+ with App Router (React Server Components).

**Rationale**:
- Next.js is specified in Constitution's Phase II technology matrix
- App Router provides modern React patterns (Server Components, Server Actions)
- Built-in routing and API routes if needed
- Excellent TypeScript support

**Alternatives Considered**:
- CRA (Create React App): Rejected - No longer maintained, Next.js provides better DX
- Vite + React: Rejected - Next.js provides built-in routing and SSR capabilities
- Remix: Rejected - Less familiar to team, Next.js preferred per constitution

---

## Decision: Tailwind CSS for Styling

**Decision**: Use Tailwind CSS for responsive, mobile-first styling.

**Rationale**:
- Mobile-first responsive design required per spec
- Utility-first approach speeds up development
- Small bundle size (purges unused styles)
- Industry standard for modern React applications

**Alternatives Considered**:
- CSS Modules: Rejected - More verbose, no built-in responsive utilities
- Styled Components: Rejected - Runtime overhead, larger bundle
- Bootstrap: Rejected - Customization limited, dated design patterns

---

## Decision: REST API over WebSockets

**Decision**: Use REST JSON APIs with polling for refresh (no WebSockets).

**Rationale**:
- Constitution explicitly prohibits real-time features (no WebSockets/SSE)
- Polling is acceptable per spec for refresh
- Simpler implementation than real-time
- Better for cost/performance in Phase II

**Implementation Details**:
- API client fetches todos on page mount
- Manual refresh button for updates
- Optimistic UI updates on user actions

---

## Decision: Monorepo Structure (frontend/ + backend/)

**Decision**: Separate frontend and backend in monorepo structure.

**Rationale**:
- Clear separation of concerns
- Independent deployment possible in future
- Matches constitution's technology matrix structure
- Each can use appropriate tooling (npm vs uv/pip)

**Structure**:
```
repo/
├── frontend/  # Next.js, npm packages
├── backend/   # FastAPI, uv/pip packages
└── specs/     # Shared documentation
```

---

## Need for Clarification: None

All technical decisions were specified in the user's technical plan or determined by constitution. No clarifications were needed.
