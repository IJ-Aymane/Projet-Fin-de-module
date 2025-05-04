from app.core.database import SessionLocal
from app.models.citizen import Citizen
from app.models.signalement import Signalement

def seed():
    db = SessionLocal()

    citizen = Citizen(
        nom="Dupont",
        prenom="Jean",
        email="jean.dupont@example.com"
    )
    db.add(citizen)
    db.commit()
    db.refresh(citizen)

    signalement = Signalement(
        citizen_id=citizen.id,
        titre="Lampadaire cassé",
        localisation="Place de la République",
        ville="Paris",
        description="Un lampadaire ne fonctionne plus.",
        categorie="admin",
        gravite="mineur",
        status="nouveau"
    )
    db.add(signalement)
    db.commit()
    db.close()

    print("Données de test insérées.")

