from app.core.database import Base, engine
from app.models.signalement import Signalement
# Import other models if needed

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Creating database tables...")
    init_db()
    print("Tables created successfully!")