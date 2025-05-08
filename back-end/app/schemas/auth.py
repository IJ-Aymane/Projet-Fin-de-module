from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int

class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[int] = None
    role: Optional[str] = None