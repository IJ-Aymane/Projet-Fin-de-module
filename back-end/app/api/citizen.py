from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List  # Ajout de l'import manquant
from app.core.database import get_db
from app.schemas.citizen import CitizenOut, CitizenCreate, CitizenUpdate
from app.crud.citizen import (
    get_all_citizens,
    create_citizen,
    update_citizen,
    get_citizen_by_id,
    get_citizen_by_email,
    delete_citizen as crud_delete_citizen
)
from app.models.citizen import Citizen

router = APIRouter(prefix="/citizens", tags=["Citizens"])

@router.get("/", response_model=List[CitizenOut], summary="List all citizens")
async def list_citizens(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    try:
        return get_all_citizens(db, skip=skip, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=CitizenOut, status_code=status.HTTP_201_CREATED)
async def create_new_citizen(
    citizen_data: CitizenCreate,
    db: Session = Depends(get_db)
):
    if get_citizen_by_email(db, citizen_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    try:
        return create_citizen(db, citizen_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/{citizen_id}", response_model=CitizenOut)
async def get_citizen(
    citizen_id: int,
    db: Session = Depends(get_db)
):
    citizen = get_citizen_by_id(db, citizen_id)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citizen not found"
        )
    return citizen

@router.put("/{citizen_id}", response_model=CitizenOut)
async def update_existing_citizen(
    citizen_id: int,
    citizen_data: CitizenUpdate,
    db: Session = Depends(get_db)
):
    try:
        return update_citizen(db, citizen_id, citizen_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{citizen_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_citizen(
    citizen_id: int,
    db: Session = Depends(get_db)
):
    if not crud_delete_citizen(db, citizen_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citizen not found"
        )