from fastapi import APIRouter
from .signalement import router as signalement_router

api_router = APIRouter()
api_router.include_router(signalement_router, prefix="/api", tags=["signalements"])