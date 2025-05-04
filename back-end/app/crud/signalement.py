from sqlalchemy.orm import Session
from app.models.signalement import Signalement
from app.schemas.signalement import SignalementCreate

def get_all_signalements(db: Session):
    return db.query(Signalement).all()

def create_signalement(db: Session, signalement: SignalementCreate):
    db_signalement = Signalement(**signalement.model_dump())
    db.add(db_signalement)
    db.commit()
    db.refresh(db_signalement)
    return db_signalement

def update_signalement(db: Session, signalement_id: int, signalement_data: dict):
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    if not signalement:
        return None
    for key, value in signalement_data.items():
        setattr(signalement, key, value)
    db.commit()
    db.refresh(signalement)
    return signalement
