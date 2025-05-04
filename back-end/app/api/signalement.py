from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.signalement import SignalementOut, SignalementCreate, SignalementUpdate
from app.crud.signalement import (
    get_all_signalements,
    create_signalement,
    update_signalement
)
from app.models.signalement import Signalement

router = APIRouter()

# GET : récupérer tous les signalements
@router.get("/", response_model=list[SignalementOut])
def get_signalements(db: Session = Depends(get_db)):
    return get_all_signalements(db)

# POST : créer un signalement
@router.post("/", response_model=SignalementOut)
def create_signalement_endpoint(
    signalement: SignalementCreate,
    db: Session = Depends(get_db)
):
    try:
        if not signalement.citizen_id or signalement.citizen_id <= 0:
            raise HTTPException(status_code=400, detail="citizen_id invalide")
        return create_signalement(db=db, signalement=signalement)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# DELETE : supprimer un signalement
@router.delete("/{id}", response_model=dict)
def delete_signalement(id: int, db: Session = Depends(get_db)):
    signalement = db.query(Signalement).filter(Signalement.id == id).first()
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement non trouvé")

    db.delete(signalement)
    db.commit()
    return {"message": f"Signalement avec ID {id} supprimé avec succès"}

# PUT : mettre à jour un signalement
@router.put("/{id}", response_model=SignalementOut)
def update_signalement_endpoint(
    id: int,
    update_data: SignalementUpdate,
    db: Session = Depends(get_db)
):
    updated = update_signalement(db, id, update_data.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Signalement non trouvé")
    return updated
