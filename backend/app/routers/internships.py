from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from ..database import get_db
from ..models.internship import Internship
from ..models.company import Company
from ..models.user import User
from ..models.application import Application
from ..models.resume import Resume
from ..dependencies import get_current_user
from ..schemas.internship import InternshipCreate, InternshipOut
from ..schemas.application import ApplicationCreate, ApplicationOut
from typing import List, Optional

router = APIRouter()

@router.post("/", response_model=InternshipOut)
def create_internship(
    internship: InternshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != 'hr':
        raise HTTPException(status_code=403, detail="Only HR can post internships")

    # Find or create company
    company = db.query(Company).filter(Company.name == internship.company_name).first()
    if not company:
        company = Company(name=internship.company_name)
        db.add(company)
        db.commit()
        db.refresh(company)

    db_internship = Internship(
        title=internship.title,
        company_id=company.id,
        location=internship.location,
        stipend=internship.stipend,
        description=internship.description,
        min_qualifications=internship.min_qualifications,
        expected_qualifications=internship.expected_qualifications,
        deadline=internship.deadline,
        posted_by=current_user.id
    )
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)

    return InternshipOut(
        id=db_internship.id,
        title=db_internship.title,
        company_name=company.name,
        location=db_internship.location,
        stipend=db_internship.stipend,
        description=db_internship.description,
        min_qualifications=db_internship.min_qualifications,
        expected_qualifications=db_internship.expected_qualifications,
        deadline=db_internship.deadline,
        posted_at=db_internship.posted_at,
        posted_by_name=current_user.name
    )

@router.get("/", response_model=List[InternshipOut])
def get_internships(
    q: Optional[str] = None,
    company: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Internship).join(Company).join(User, Internship.posted_by == User.id)

    if q:
        query = query.filter(or_(Internship.title.contains(q), Internship.description.contains(q)))
    if company:
        query = query.filter(Company.name.contains(company))
    if location:
        query = query.filter(Internship.location.contains(location))

    internships = query.all()
    result = []
    for i in internships:
        result.append(InternshipOut(
            id=i.id,
            title=i.title,
            company_name=i.company.name,
            location=i.location,
            stipend=i.stipend,
            description=i.description,
            min_qualifications=i.min_qualifications,
            expected_qualifications=i.expected_qualifications,
            deadline=i.deadline,
            posted_at=i.posted_at,
            posted_by_name=i.posted_by_user.name
        ))
    return result

@router.get("/{id}", response_model=InternshipOut)
def get_internship(id: int, db: Session = Depends(get_db)):
    internship = db.query(Internship).join(Company).join(User, Internship.posted_by == User.id).filter(Internship.id == id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    return InternshipOut(
        id=internship.id,
        title=internship.title,
        company_name=internship.company.name,
        location=internship.location,
        stipend=internship.stipend,
        description=internship.description,
        min_qualifications=internship.min_qualifications,
        expected_qualifications=internship.expected_qualifications,
        deadline=internship.deadline,
        posted_at=internship.posted_at,
        posted_by_name=internship.posted_by_user.name
    )
