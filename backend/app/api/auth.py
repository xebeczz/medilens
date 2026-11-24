from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import hash_password, verify_password, create_access_token
from ..models.models import User
from ..schemas.schemas import UserCreate, UserOut, Token
from .deps import get_current_user
router = APIRouter(prefix="/auth", tags=["auth"])
@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first(): raise HTTPException(400, "Email already registered")
    u = User(full_name=payload.full_name, email=payload.email, password_hash=hash_password(payload.password))
    db.add(u); db.commit(); db.refresh(u); return u
@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == form.username).first()
    if not u or not verify_password(form.password, u.password_hash): raise HTTPException(401, "Invalid credentials")
    return {"access_token": create_access_token({"sub": u.email}), "token_type": "bearer"}
@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)): return user
