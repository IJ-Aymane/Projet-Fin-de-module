from pydantic import BaseModel, EmailStr

class CitizenBase(BaseModel):
    nom: str
    prenom: str
    email: EmailStr

class CitizenCreate(CitizenBase):
    pass

class CitizenOut(CitizenBase):
    id: int

    class Config:
        from_attributes = True