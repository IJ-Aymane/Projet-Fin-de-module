from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.signalement import router as signalement_router
from app.core.database import engine
from app.models import Citizen, Signalement  # Import models directly

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables at startup
@app.on_event("startup")
def create_tables():
    from app.models import Base  # Import Base from models/__init__.py
    Base.metadata.create_all(bind=engine)

# Inclusion du routeur avec le bon préfixe
app.include_router(signalement_router, prefix="/api/signalements", tags=["signalements"])