import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel
from src.models import task, user  # Import models to register them

load_dotenv()

# Fallback to local sqlite for development if DATABASE_URL is missing
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./todo.db"
    print("WARNING: DATABASE_URL not found. Falling back to local SQLite: todo.db")

# SQLite needs special args for concurrent access
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
