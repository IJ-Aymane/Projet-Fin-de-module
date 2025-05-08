# This file isn't directly used in your current setup
# It's provided for reference or future use if needed

from fastapi import APIRouter
from .signalement import router as signalement_router
from .citizen import router as citizen_router
from .auth import router as auth_router

api_router = APIRouter()
api_router.include_router(auth_router, tags=["authentication"])
api_router.include_router(citizen_router, tags=["citizens"])
api_router.include_router(signalement_router, tags=["signalements"])

# To use this central router, modify main.py to:
# from app.api.router import api_router
# app.include_router(api_router)