from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.internship import Internship
from ..models.company import Company
from ..schemas.internship import InternshipCreate, InternshipUpdate


class InternshipService:
    def __init__(self, db: Session):
        self.db = db

    def get_internship_by_id(self, internship_id: int) -> Optional[Internship]:
        return self.db.query(Internship).filter(Internship.id == internship_id).first()

    def get_internships(
        self, 
        skip: int = 0, 
        limit: int = 100,
        company_id: Optional[int] = None,
        posted_by: Optional[int] = None,
        is_active: Optional[str] = None
    ) -> List[Internship]:
        query = self.db.query(Internship)
        
        if company_id:
            query = query.filter(Internship.company_id == company_id)
        if posted_by:
            query = query.filter(Internship.posted_by == posted_by)
        if is_active:
            query = query.filter(Internship.is_active == is_active)
            
        return query.offset(skip).limit(limit).all()

    def create_internship(self, internship: InternshipCreate, posted_by: int) -> Internship:
        # Get or create company
        company = self.db.query(Company).filter(Company.name == internship.company_name).first()
        if not company:
            company = Company(name=internship.company_name)
            self.db.add(company)
            self.db.flush()  # Get the company ID without committing
        
        db_internship = Internship(
            title=internship.title,
            company_id=company.id,
            location=internship.location,
            stipend=internship.stipend,
            description=internship.description,
            min_qualifications=internship.min_qualifications,
            expected_qualifications=internship.expected_qualifications,
            deadline=internship.deadline,
            posted_by=posted_by,
            is_active=internship.is_active
        )
        self.db.add(db_internship)
        self.db.commit()
        self.db.refresh(db_internship)
        return db_internship

    def update_internship(self, internship_id: int, internship_update: InternshipUpdate) -> Optional[Internship]:
        db_internship = self.get_internship_by_id(internship_id)
        if not db_internship:
            return None
        
        update_data = internship_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_internship, field, value)
        
        self.db.commit()
        self.db.refresh(db_internship)
        return db_internship

    def delete_internship(self, internship_id: int) -> bool:
        db_internship = self.get_internship_by_id(internship_id)
        if not db_internship:
            return False
        
        self.db.delete(db_internship)
        self.db.commit()
        return True

    def search_internships(self, query: str, location: str = None, company: str = None) -> List[Internship]:
        db_query = self.db.query(Internship).join(Company)
        
        if query:
            db_query = db_query.filter(
                Internship.title.ilike(f"%{query}%") | 
                Internship.description.ilike(f"%{query}%")
            )
        
        if location:
            db_query = db_query.filter(Internship.location.ilike(f"%{location}%"))
        
        if company:
            db_query = db_query.filter(Company.name.ilike(f"%{company}%"))
        
        return db_query.all()
