# Todo Evolution - Phase II: Full-Stack Web Application

This repository contains Phase II of the Todo Evolution project, transitioning from a console app to a full-stack web application.

## 🚀 Getting Started

### Prerequisites
- Python 3.13+ (using `uv`)
- Node.js 18+ (using `npm`)
- Neon Serverless PostgreSQL Database

### Backend Setup (FastAPI)
1. Navigate to backend: `cd backend`
2. Create `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@host.neon.tech/todo?sslmode=require
   JWT_SECRET=your-jwt-secret
   ```
3. Install dependencies: `uv pip install -r requirements.txt`
4. Run migrations: `uv run alembic upgrade head`
5. Start server: `uvicorn src.main:app --reload`

### Frontend Setup (Next.js)
1. Navigate to frontend: `cd frontend`
2. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

## 🛠 Features
- **User Authentication**: Secure signup and login flows.
- **RESTful API**: FastAPI backend with JWT protection.
- **Persistent Storage**: SQLModel ORM with Neon PostgreSQL.
- **Responsive UI**: Modern Next.js application with Tailwind CSS.
- **Data Isolation**: Users manage only their own todos.

## 📁 Structure
- `backend/`: FastAPI source code, models, and migrations.
- `frontend/`: Next.js application, components, and API client.
- `specs/`: Phase II documentation and task lists.
