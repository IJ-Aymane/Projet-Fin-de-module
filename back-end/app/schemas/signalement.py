from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from enum import Enum


class CategorieEnum(str, Enum):
    police = "police"
    hopital = "hopital"
    admin = "admin"

class GraviteEnum(str, Enum):
    mineur = "mineur"
    majeur = "majeur"
    urgent = "urgent"

class StatusEnum(str, Enum):
    nouveau = "nouveau"
    en_cours = "en_cours"
    résolu = "résolu"

class SignalementBase(BaseModel):
    citizen_id: int
    titre: str
    localisation: str
    ville: str
    description: str
    categorie: CategorieEnum
    gravite: GraviteEnum = GraviteEnum.mineur
    status: StatusEnum = StatusEnum.nouveau
    commentaire: Optional[str] = None

class SignalementCreate(SignalementBase):
    pass

class SignalementOut(SignalementBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        

class SignalementUpdate(BaseModel):
    titre: Optional[str]
    localisation: Optional[str]
    ville: Optional[str]
    description: Optional[str]
    categorie: Optional[CategorieEnum]
    gravite: Optional[GraviteEnum]
    status: Optional[StatusEnum]
    commentaire: Optional[str] = None

    class Config:
        from_attributes = True
