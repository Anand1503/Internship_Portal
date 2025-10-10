from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models import Resume, User
from ..utils.security import get_current_user
from ..utils.storage import save_resume_file
from ..schemas import ResumeResponse

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.post("/", response_model=ResumeResponse)
async def upload_resume(
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a resume PDF file for the current user.

    - **title**: Title for the resume
    - **file**: PDF file to upload

    Returns the created resume object.
    """
    file_path = await save_resume_file(file)
    db_resume = Resume(user_id=current_user.id, title=title, file_path=file_path)
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.get("/me", response_model=list[ResumeResponse])
def get_my_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get all resumes for the current user.

    Returns a list of resume objects.
    """
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes
