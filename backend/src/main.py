from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from src.core.db import init_db
from src.dependencies.auth import get_current_user
from src.api.routes import todos
from src.api.routes import auth

app = FastAPI(title="Todo API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://192.168.0.112:3000",  # Network address from dev server
        "http://192.168.0.112:3001",  # Network address for port 3001
        "http://192.168.0.112:3002"   # Network address for port 3002
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(todos.router)
app.include_router(auth.router)

@app.on_event("startup")
def on_startup():
    # Automatically create tables for local development
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo Evolution API", "docs": "/docs", "health": "/health"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/protected-test")
def protected_test(current_user: str = Depends(get_current_user)):
    return {"user_id": current_user}
