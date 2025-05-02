from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from typing import List

from models import User, UserCreate, UserUpdate, Token
from auth import (
    hash_password, verify_password, create_access_token, 
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing, in production specify domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database
users_db = [
    {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": hash_password("password123"),
        "is_active": True
    }
]

# Helper to find next id for new users
def get_next_user_id():
    return max([user["id"] for user in users_db], default=0) + 1

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI app!"}

@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = next((user for user in users_db if user["username"] == form_data.username), None)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=User)
def register_user(user: UserCreate):
    # Verify username is unique
    if any(u["username"] == user.username for u in users_db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    # Verify email is unique
    if any(u["email"] == user.email for u in users_db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    new_user = {
        "id": get_next_user_id(),
        "username": user.username,
        "email": user.email,
        "hashed_password": hash_password(user.password),
        "is_active": True
    }
    users_db.append(new_user)
    
    # Return user without password
    return {
        "id": new_user["id"],
        "username": new_user["username"],
        "email": new_user["email"],
        "is_active": new_user["is_active"]
    }

@app.get("/users", response_model=List[User])
def read_users(current_user: dict = Depends(lambda token: get_current_user(token, users_db))):
    """Get all users (authenticated users only)"""
    return [{
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "is_active": user["is_active"]
    } for user in users_db]

@app.get("/users/me", response_model=User)
def read_users_me(current_user: dict = Depends(lambda token: get_current_user(token, users_db))):
    """Get current user information"""
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "is_active": current_user["is_active"]
    }

@app.put("/users/me", response_model=User)
def update_user(
    user_update: UserUpdate,
    current_user: dict = Depends(lambda token: get_current_user(token, users_db))
):
    """Update current user information"""
    # Find user in db
    user_index = next((i for i, u in enumerate(users_db) if u["id"] == current_user["id"]), None)
    
    if user_update.username:
        # Check if new username is unique
        if any(u["username"] == user_update.username and u["id"] != current_user["id"] for u in users_db):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        users_db[user_index]["username"] = user_update.username
        
    if user_update.email:
        # Check if new email is unique
        if any(u["email"] == user_update.email and u["id"] != current_user["id"] for u in users_db):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        users_db[user_index]["email"] = user_update.email
        
    if user_update.password:
        users_db[user_index]["hashed_password"] = hash_password(user_update.password)
    
    updated_user = users_db[user_index]
    return {
        "id_": updated_user["id"],
        "username": updated_user["username"],
        "email": updated_user["email"],
        "is_active": updated_user["is_active"]
    }

@app.delete("/users/{user_id}", response_model=User)
def delete_user(
    user_id: int,
    current_user: dict = Depends(lambda token: get_current_user(token, users_db))
):
    """Delete a user (can only delete yourself)"""
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete other users"
        )
    
    user_index = next((i for i, u in enumerate(users_db) if u["id"] == user_id), None)
    if user_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    deleted_user = users_db.pop(user_index)
    return {
        "id": deleted_user["id"],
        "username": deleted_user["username"],
        "email": deleted_user["email"],
        "is_active": deleted_user["is_active"]
    }