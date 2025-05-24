from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.signalement import Signalement
from app.schemas.signalement import SignalementCreate
from typing import Dict, Any, Optional

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

def search_signalements(db: Session, search_params: Dict[str, Any]):
    """
    Rechercher des signalements selon différents critères
    """
    query = db.query(Signalement)
    conditions = []
    
    # Recherche par titre (insensible à la casse, recherche partielle)
    if search_params.get("titre") and search_params["titre"].strip():
        conditions.append(Signalement.titre.ilike(f"%{search_params['titre'].strip()}%"))
    
    # Recherche par ville (insensible à la casse, recherche partielle)
    if search_params.get("ville") and search_params["ville"].strip():
        conditions.append(Signalement.ville.ilike(f"%{search_params['ville'].strip()}%"))
    
    # Filtre par catégorie (exact)
    if search_params.get("categorie") and search_params["categorie"].strip():
        conditions.append(Signalement.categorie == search_params["categorie"].strip())
    
    # Filtre par status (exact)
    if search_params.get("status") and search_params["status"].strip():
        conditions.append(Signalement.status == search_params["status"].strip())
    
    # Filtre par gravité (exact)
    if search_params.get("gravite") and search_params["gravite"].strip():
        conditions.append(Signalement.gravite == search_params["gravite"].strip())
    
    # Filtre par citizen_id (exact)
    if search_params.get("citizen_id") and search_params["citizen_id"] > 0:
        conditions.append(Signalement.citizen_id == search_params["citizen_id"])
    
    # Recherche dans la description (insensible à la casse, recherche partielle)
    if search_params.get("description") and search_params["description"].strip():
        conditions.append(Signalement.description.ilike(f"%{search_params['description'].strip()}%"))
    
    # Appliquer tous les filtres avec AND
    if conditions:
        query = query.filter(and_(*conditions))
    
    # Ordonner par date de création (plus récent en premier)
    return query.order_by(Signalement.created_at.desc()).all()

def search_signalements_advanced(db: Session, 
                               titre: Optional[str] = None,
                               ville: Optional[str] = None,
                               localisation: Optional[str] = None,
                               categories: Optional[list] = None,
                               statuses: Optional[list] = None,
                               gravites: Optional[list] = None,
                               citizen_id: Optional[int] = None,
                               text_search: Optional[str] = None):
    """
    Recherche avancée avec plus d'options
    """
    query = db.query(Signalement)
    conditions = []
    
    # Recherche textuelle dans titre, description et commentaire
    if text_search and text_search.strip():
        text_search = text_search.strip()
        text_conditions = [
            Signalement.titre.ilike(f"%{text_search}%"),
            Signalement.description.ilike(f"%{text_search}%"),
            Signalement.commentaire.ilike(f"%{text_search}%")
        ]
        conditions.append(or_(*text_conditions))
    
    # Recherche par titre spécifique
    if titre and titre.strip():
        conditions.append(Signalement.titre.ilike(f"%{titre.strip()}%"))
    
    # Recherche par ville
    if ville and ville.strip():
        conditions.append(Signalement.ville.ilike(f"%{ville.strip()}%"))
    
    # Recherche par localisation
    if localisation and localisation.strip():
        conditions.append(Signalement.localisation.ilike(f"%{localisation.strip()}%"))
    
    # Filtre par multiples catégories
    if categories and len(categories) > 0:
        # Nettoyer les catégories vides
        clean_categories = [cat.strip() for cat in categories if cat and cat.strip()]
        if clean_categories:
            conditions.append(Signalement.categorie.in_(clean_categories))
    
    # Filtre par multiples statuts
    if statuses and len(statuses) > 0:
        # Nettoyer les statuts vides
        clean_statuses = [status.strip() for status in statuses if status and status.strip()]
        if clean_statuses:
            conditions.append(Signalement.status.in_(clean_statuses))
    
    # Filtre par multiples gravités
    if gravites and len(gravites) > 0:
        # Nettoyer les gravités vides
        clean_gravites = [gravite.strip() for gravite in gravites if gravite and gravite.strip()]
        if clean_gravites:
            conditions.append(Signalement.gravite.in_(clean_gravites))
    
    # Filtre par citizen_id
    if citizen_id and citizen_id > 0:
        conditions.append(Signalement.citizen_id == citizen_id)
    
    # Appliquer tous les filtres
    if conditions:
        query = query.filter(and_(*conditions))
    
    return query.order_by(Signalement.created_at.desc()).all()