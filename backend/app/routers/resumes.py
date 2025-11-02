from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

from ..database import get_db
from ..models.resume import Resume
from ..models.user import User
from ..dependencies import get_current_user
from ..utils.storage import save_resume_file
from ..schemas.resume import ResumeCreate, ResumeOut

router = APIRouter()

async def _create_resume_logic(
    title: str,
    file: UploadFile,
    current_user: User,
    db: Session
) -> ResumeOut:
    """Shared logic for creating a resume"""
    # Validate file is PDF (additional check, though storage also validates)
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Save the file
    file_path = await save_resume_file(file)

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

@router.post("/", response_model=ResumeOut)
async def create_resume(
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await _create_resume_logic(title, file, current_user, db)

@router.post("/upload", response_model=ResumeOut)
async def upload_resume(
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload endpoint alias for frontend compatibility"""
    return await _create_resume_logic(title, file, current_user, db)

@router.get("/me", response_model=List[ResumeOut])
def get_my_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return [ResumeOut.from_orm(resume) for resume in resumes]

@router.get("/{resume_id}/download")
def download_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download a resume file"""
    # Get the resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Check if file exists
    if not os.path.exists(resume.file_path):
        raise HTTPException(status_code=404, detail="Resume file not found on server")
    
    # Return the file
    return FileResponse(
        path=resume.file_path,
        media_type='application/pdf',
        filename=f"{resume.title}.pdf"
    )
