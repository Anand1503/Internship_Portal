from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.application import Application
from ..models.internship import Internship
from ..models.resume import Resume
from ..models.company import Company
from ..models.user import User
from ..dependencies import get_current_user
from ..schemas.application import ApplicationCreate, ApplicationOut
from typing import List

router = APIRouter()

@router.post("/", response_model=ApplicationOut)
def create_application(
    application: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate resume belongs to user
    resume = db.query(Resume).filter(Resume.id == application.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=400, detail="Resume not found or does not belong to user")

    # Validate internship exists
    internship = db.query(Internship).join(Company).filter(Internship.id == application.internship_id).first()
    if not internship:
        raise HTTPException(status_code=400, detail="Internship not found")

    # Check if already applied
    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.internship_id == application.internship_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this internship")

    db_application = Application(
        user_id=current_user.id,
        internship_id=application.internship_id,
        resume_id=application.resume_id,
        cover_letter=application.cover_letter,
        status="pending"
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return ApplicationOut(
        id=db_application.id,
        internship_id=internship.id,
        internship_title=internship.title,
        company_name=internship.company.name,
        resume_id=resume.id,
        resume_title=resume.title,
        cover_letter=db_application.cover_letter,
        status=db_application.status,
        applied_at=db_application.applied_at
    )

@router.get("/me", response_model=List[ApplicationOut])
def get_my_applications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    applications = db.query(Application).join(Internship).join(Company, Internship.company_id == Company.id).join(Resume).filter(Application.user_id == current_user.id).all()
    result = []
    for a in applications:
        result.append(ApplicationOut(
            id=a.id,
            internship_id=a.internship.id,
            internship_title=a.internship.title,
            company_name=a.internship.company.name,
            resume_id=a.resume.id,
            resume_title=a.resume.title,
            cover_letter=a.cover_letter,
            status=a.status,
            applied_at=a.applied_at
        ))
    return result
