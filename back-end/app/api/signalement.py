from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.schemas.signalement import SignalementOut, SignalementCreate, SignalementUpdate
from app.crud.signalement import (
    get_all_signalements,
    create_signalement,
    update_signalement,
    search_signalements
)
from app.models.signalement import Signalement

router = APIRouter()

# GET : récupérer tous les signalements
@router.get("/", response_model=list[SignalementOut])
def get_signalements(db: Session = Depends(get_db)):
    return get_all_signalements(db)

# GET : rechercher des signalements
@router.get("/search", response_model=list[SignalementOut])
def search_signalements_endpoint(
    db: Session = Depends(get_db),
    titre: Optional[str] = Query(None, description="Rechercher par titre"),
    ville: Optional[str] = Query(None, description="Rechercher par ville"),
    categorie: Optional[str] = Query(None, description="Filtrer par catégorie"),
    status: Optional[str] = Query(None, description="Filtrer par status"),
    gravite: Optional[str] = Query(None, description="Filtrer par gravité"),
    citizen_id: Optional[int] = Query(None, description="Filtrer par ID citoyen"),
    description: Optional[str] = Query(None, description="Rechercher dans la description")
):
    """
    Rechercher des signalements selon différents critères.
    Tous les paramètres sont optionnels et peuvent être combinés.
    """
    # Filtrer les paramètres None ou vides avant de les passer
    search_params = {}
    
    if titre and titre.strip():
        search_params["titre"] = titre.strip()
    if ville and ville.strip():
        search_params["ville"] = ville.strip()
    if categorie and categorie.strip():
        search_params["categorie"] = categorie.strip()
    if status and status.strip():
        search_params["status"] = status.strip()
    if gravite and gravite.strip():
        search_params["gravite"] = gravite.strip()
    if citizen_id and citizen_id > 0:
        search_params["citizen_id"] = citizen_id
    if description and description.strip():
        search_params["description"] = description.strip()
    
    return search_signalements(db, search_params)

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