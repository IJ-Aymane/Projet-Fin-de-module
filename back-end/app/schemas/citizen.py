from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class CitizenBase(BaseModel):
    email: EmailStr
    numero_telephone: Optional[str] = None

class CitizenCreate(CitizenBase):
    password_hash: str

class CitizenUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password_hash: Optional[str] = None
    numero_telephone: Optional[str] = None

        
class CitizenOut(CitizenBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # Au lieu de orm_mode