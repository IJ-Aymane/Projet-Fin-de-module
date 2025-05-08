from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
import traceback
import logging
import os

from app.core.database import get_db
from app.models.citizen import Citizen

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a router object
router = APIRouter(tags=["authentication"])

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# JWT settings
SECRET_KEY = "your-secret-key-change-this-in-production"  # Better to get from environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password verification
def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {str(e)}")
        # If the password is not hashed (plain text in DB), do direct comparison
        # WARNING: This is for testing only - in production, always use hashed passwords
        return plain_password == hashed_password

# Password hashing
def get_password_hash(password):
    return pwd_context.hash(password)

# Create JWT token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logger.error(f"Token creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating authentication token"
        )

# Authentication function
def authenticate_user(db: Session, email: str, password: str):
    try:
        # Check if admin table exists, and if so, try to authenticate as admin
        try:
            # Import at function level to avoid import errors if table doesn't exist
            from app.models.admin import Admin
            
            admin = db.query(Admin).filter(Admin.email == email).first()
            logger.info(f"Admin lookup result for {email}: {'Found' if admin else 'Not found'}")
            
            if admin and verify_password(password, admin.password_hash):
                return {"user": admin, "role": "admin"}
        except Exception as e:
            logger.warning(f"Admin authentication attempt failed: {str(e)}")
            # Continue to citizen authentication
        
        # Try to authenticate as citizen
        citizen = db.query(Citizen).filter(Citizen.email == email).first()
        logger.info(f"Citizen lookup result for {email}: {'Found' if citizen else 'Not found'}")
        
        if citizen and verify_password(password, citizen.password_hash):
            return {"user": citizen, "role": "citizen"}
        
        # If not found in either table
        return None
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}\n{traceback.format_exc()}")
        return None

# Login endpoint
@router.post("/login")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Login attempt for email: {form_data.username}")
        
        user_info = authenticate_user(db, form_data.username, form_data.password)
        
        if not user_info:
            logger.warning(f"Failed login attempt for: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create token data
        user = user_info["user"]
        role = user_info["role"]
        token_data = {
            "sub": user.email,
            "id": user.id,
            "role": role
        }
        
        # Create token with expiration
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data=token_data, 
            expires_delta=access_token_expires
        )
        
        logger.info(f"Successful login for: {form_data.username} with role: {role}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": role,
            "user_id": user.id,
            "email": user.email
        }
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Login error: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during login: {str(e)}"
        )

# Get current user based on token
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("id")
        role: str = payload.get("role")
        
        if email is None:
            logger.warning("Token missing email claim")
            raise credentials_exception
        
        logger.info(f"Token validation for user: {email}, role: {role}")
        
        if role == "admin":
            try:
                from app.models.admin import Admin
                user = db.query(Admin).filter(Admin.id == user_id).first()
            except Exception:
                logger.warning("Admin table not available")
                raise credentials_exception
        else:
            user = db.query(Citizen).filter(Citizen.id == user_id).first()
            
        if user is None:
            logger.warning(f"User not found: {email}, role: {role}")
            raise credentials_exception
            
        return {"user": user, "role": role}
        
    except jwt.PyJWTError as e:
        logger.error(f"JWT error: {str(e)}")
        raise credentials_exception
    except Exception as e:
        error_msg = f"Authentication error: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during authentication: {str(e)}"
        )

# Endpoint to get current user info
@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    try:
        user = current_user["user"]
        role = current_user["role"]
        return {
            "id": user.id,
            "email": user.email,
            "role": role
        }
    except Exception as e:
        error_msg = f"Error getting user info: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error retrieving user information: {str(e)}"
        )