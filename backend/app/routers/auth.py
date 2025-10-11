from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, Token
from ..utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)
from ..core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.

    Accepts JSON: {name, email, password}
    Hashes password and creates User row with default role "student".

    Example curl:
    curl -X POST "http://localhost:8000/auth/register" \
         -H "Content-Type: application/json" \
         -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
    """
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and create user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role="student"  # Default role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login user and return JWT token.

    Accepts form data: username (email), password
    Validates credentials and issues JWT with claims {"sub": user.id, "role": user.role}.

    Example curl:
    curl -X POST "http://localhost:8000/auth/token" \
         -H "Content-Type: application/x-www-form-urlencoded" \
         -d "username=john@example.com&password=password123"
    """
    # Find user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user information.

    Protected by get_current_user dependency.

    Example curl:
    curl -X GET "http://localhost:8000/auth/me" \
         -H "Authorization: Bearer YOUR_JWT_TOKEN"
    """
    return current_user

# To include this router in the app factory, add the following in backend/app/__init__.py:
# from app.routers.auth import router as auth_router
# app.include_router(auth_router)
