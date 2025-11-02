from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserOut, Token, UserLogin
from ..services.user_service import UserService
from ..utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from ..dependencies import get_current_user
from ..core.config import settings

class UserUpdate(BaseModel):
    name: str

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.

    Accepts JSON: {name, email, password, role}
    Hashes password and creates User row with default role "student".
    """
    user_service = UserService(db)
    
    # Check if user already exists
    db_user = user_service.get_user_by_email(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    db_user = user_service.create_user(user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login user and return JWT token.

    Accepts form data: username (email), password
    Validates credentials and issues JWT with claims {"sub": user.email, "role": user.role}.
    """
    user_service = UserService(db)
    
    # Find user by email
    user = user_service.get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user information.

    Protected by get_current_user dependency.
    """
    return current_user

@router.put("/me", response_model=UserOut)
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile information.
    
    Currently only allows updating the name field.
    """
    # Update user name
    current_user.name = user_update.name
    db.commit()
    db.refresh(current_user)
    return current_user
