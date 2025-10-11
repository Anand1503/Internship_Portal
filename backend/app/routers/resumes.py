from fastapi import APIRouter, Depends, Form, UploadFile, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models import Resume, User
from app.utils.security import get_current_user
from app.utils.storage import save_resume_file
from app.schemas import ResumeCreate, ResumeOut

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.post("/", response_model=ResumeOut)
def create_resume(
    title: str = Form(...),
    file: UploadFile = Depends(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file is PDF (additional check, though storage also validates)
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Save the file
    file_path = save_resume_file(file)

    # Create resume record
    db_resume = Resume(
        user_id=current_user.id,
        title=title,
        file_path=file_path
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    return ResumeOut.from_orm(db_resume)

@router.get("/me", response_model=List[ResumeOut])
def get_my_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return [ResumeOut.from_orm(resume) for resume in resumes]
