from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.citizen import router as citizen_router
from app.api.signalement import router as signalement_router
from app.api.auth import router as auth_router
from app.core.database import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def create_tables():
    from app.models import Base
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/auth")
app.include_router(citizen_router)
app.include_router(signalement_router, prefix="/signalements")