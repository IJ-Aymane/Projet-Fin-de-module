from sqlalchemy import Column, Integer, String, Text, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Signalement(Base):
    __tablename__ = "signalements"

    id = Column(Integer, primary_key=True, index=True)
    citizen_id = Column(Integer, ForeignKey("citizen.id"), nullable=False)
    titre = Column(String(255), nullable=False)
    localisation = Column(String(255), nullable=False)
    ville = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    commentaire = Column(Text)
    categorie = Column(String(50), nullable=False)  # Simplifié pour le test
    gravite = Column(String(50), default='mineur')
    status = Column(String(50), default='nouveau')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())