# Quickstart: Phase II Full-Stack Web Todo Application

**Feature**: Full-Stack Web Todo Application
**Date**: 2025-12-31
**Phase**: Phase II

## Prerequisites

- **Backend**: Python 3.13+, uv, PostgreSQL client
- **Frontend**: Node.js 18+, npm or pnpm
- **Database**: Neon Serverless PostgreSQL account

## Environment Setup

### 1. Clone and Setup

```bash
# Clone the repository
git checkout 002-todo-web-app

# Navigate to project root
cd /path/to/todo
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Initialize uv project (if not already done)
uv init
uv pip install fastapi uvicorn sqlmodel alembic psycopg2-binary pydantic python-jose passlib

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:password@host.neon.tech/todo?sslmode=require
JWT_SECRET=your-jwt-secret-here
BETTER_AUTH_SECRET=your-auth-secret-here
EOF

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Initialize Next.js project (if not already done)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias

# Install dependencies
npm install better-auth @tanstack/react-query axios clsx tailwind-merge

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-auth-secret-here
EOF

# Start the frontend development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Verify Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:8000/health
   # Expected: {"status": "ok"}
   ```

2. **Frontend Access**:
   - Open `http://localhost:3000` in browser
   - You should see the landing page

## Development Workflow

### Running Tests

**Backend**:
```bash
cd backend
uv pip install pytest pytest-asyncio httpx
pytest
```

**Frontend**:
```bash
cd frontend
npm run test
```

### Database Migrations

**Create a new migration**:
```bash
cd backend
alembic revision -m "description_of_change"
# Edit the generated migration file
alembic upgrade head
```

**Apply migrations**:
```bash
alembic upgrade head
```

### API Documentation

Once the backend is running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
todo/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   │   ├── (auth)/   # Auth pages
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── todos/    # Protected todos page
│   │   │   └── page.tsx  # Landing page
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   └── ...
├── backend/               # FastAPI application
│   ├── src/
│   │   ├── api/          # API routes
│   │   ├── models/       # SQLModel models
│   │   ├── core/         # Config and DB
│   │   └── dependencies/ # Auth, etc.
│   ├── alembic/          # Migrations
│   └── ...
└── specs/002-todo-web-app/ # Feature documentation
```

## Common Tasks

### Adding a New Todo Endpoint

1. Define the model in `backend/src/api/models.py`
2. Add the route in `backend/src/api/routes/todos.py`
3. Add tests in `backend/tests/`
4. Update the API contract if needed

### Modifying the Frontend

1. Create/update components in `frontend/src/components/`
2. Add or update pages in `frontend/src/app/`
3. Test in browser at `http://localhost:3000`

### Database Changes

1. Modify the SQLModel class in `backend/src/models/`
2. Generate a migration: `alembic revision -m "description"`
3. Apply the migration: `alembic upgrade head`
4. Update the frontend types if needed

## Troubleshooting

### Database Connection Failed

1. Verify Neon credentials in `.env`
2. Check SSL mode is enabled
3. Ensure IP is allowlisted in Neon dashboard

### JWT Validation Errors

1. Verify `JWT_SECRET` matches between frontend and backend
2. Check token hasn't expired
3. Ensure `Authorization: Bearer <token>` header format is correct

### CORS Errors

1. Add frontend origin to backend CORS middleware
2. Check frontend is making requests to correct API URL

## Next Steps

After completing setup:

1. Run the full end-to-end test:
   - Sign up as a new user
   - Create a todo
   - View the todo in the list
   - Update the todo
   - Toggle completion
   - Delete the todo

2. Proceed to `/sp.tasks` to generate implementation tasks
