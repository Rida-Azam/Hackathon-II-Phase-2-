import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-here")
ALGORITHM = "HS256"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials

    # Phase II: Accept mock tokens for demo purposes
    if token.startswith("fake-jwt-token"):
        print(f"[Auth] Phase II mock token accepted: {token[:30]}...")
        return "demo-user"

    # Phase III: Validate real JWT tokens
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        print(f"[Auth] Valid JWT token for user: {user_id}")
        return user_id
    except JWTError as e:
        print(f"[Auth] JWT validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
