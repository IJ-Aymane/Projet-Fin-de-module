from sqlalchemy.orm import Session
from app.models.citizen import Citizen
from app.schemas.citizen import CitizenCreate, CitizenUpdate

def get_all_citizens(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Citizen).offset(skip).limit(limit).all()

def get_citizen_by_id(db: Session, citizen_id: int):
    return db.query(Citizen).filter(Citizen.id == citizen_id).first()

def get_citizen_by_email(db: Session, email: str):
    return db.query(Citizen).filter(Citizen.email == email).first()

def create_citizen(db: Session, citizen: CitizenCreate):
    db_citizen = Citizen(**citizen.dict())
    db.add(db_citizen)
    db.commit()
    db.refresh(db_citizen)
    return db_citizen

def update_citizen(db: Session, citizen_id: int, citizen: CitizenUpdate):
    db_citizen = get_citizen_by_id(db, citizen_id)
    if db_citizen:
        update_data = citizen.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_citizen, key, value)
        db.commit()
        db.refresh(db_citizen)
    return db_citizen

def delete_citizen(db: Session, citizen_id: int):
    db_citizen = get_citizen_by_id(db, citizen_id)
    if db_citizen:
        db.delete(db_citizen)
        db.commit()
    return db_citizen