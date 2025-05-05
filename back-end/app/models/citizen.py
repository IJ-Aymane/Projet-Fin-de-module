from app.core.database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP

class Citizen(Base):
    __tablename__ = "citizen"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    numero_telephone = Column(String(20))
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')