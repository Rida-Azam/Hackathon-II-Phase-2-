from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True, nullable=False, max_length=255)
    name: str = Field(max_length=100)


class User(UserBase, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(nullable=False)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def verify_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.hashed_password)


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)


class UserRegister(UserCreate):
    pass


class UserLogin(SQLModel):
    email: str = Field(max_length=255)
    password: str = Field(min_length=6, max_length=128)


class UserPublic(UserBase):
    id: int
    is_active: bool
    created_at: datetime