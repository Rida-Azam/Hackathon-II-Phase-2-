from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from fastapi.security import HTTPBearer
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

from src.models.user import User, UserCreate, UserLogin, UserPublic
from src.core.db import get_session
from src.dependencies.auth import JWT_SECRET, ALGORITHM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Initialize HTTPBearer for token verification
security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/register", response_model=UserPublic)
def register(user: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = pwd_context.hash(user.password)

    # Create new user
    db_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.post("/login")
def login(user_credentials: UserLogin, session: Session = Depends(get_session)):
    # Find user by email
    user = session.exec(select(User).where(User.email == user_credentials.email)).first()

    if not user or not user.verify_password(user_credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(days=30)  # Token valid for 30 days
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "name": user.name},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }


@router.post("/logout")
def logout():
    # Frontend will remove the token, backend doesn't need to do anything special
    return {"message": "Logged out successfully"}