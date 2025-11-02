from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.resume import Resume
from ..schemas.resume import ResumeCreate, ResumeUpdate


class ResumeService:
    def __init__(self, db: Session):
        self.db = db

    def get_resume_by_id(self, resume_id: int) -> Optional[Resume]:
        return self.db.query(Resume).filter(Resume.id == resume_id).first()

    def get_user_resumes(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Resume]:
        return (
            self.db.query(Resume)
            .filter(Resume.user_id == user_id, Resume.is_active == "active")
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_resume(self, resume: ResumeCreate, user_id: int, file_path: str, file_size: int, file_type: str) -> Resume:
        db_resume = Resume(
            title=resume.title,
            user_id=user_id,
            file_path=file_path,
            file_size=file_size,
            file_type=file_type
        )
        self.db.add(db_resume)
        self.db.commit()
        self.db.refresh(db_resume)
        return db_resume

    def update_resume(self, resume_id: int, resume_update: ResumeUpdate) -> Optional[Resume]:
        db_resume = self.get_resume_by_id(resume_id)
        if not db_resume:
            return None
        
        update_data = resume_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_resume, field, value)
        
        self.db.commit()
        self.db.refresh(db_resume)
        return db_resume

    def delete_resume(self, resume_id: int) -> bool:
        db_resume = self.get_resume_by_id(resume_id)
        if not db_resume:
            return False
        
        # Soft delete by marking as inactive
        db_resume.is_active = "inactive"
        self.db.commit()
        return True

    def hard_delete_resume(self, resume_id: int) -> bool:
        db_resume = self.get_resume_by_id(resume_id)
        if not db_resume:
            return False
        
        self.db.delete(db_resume)
        self.db.commit()
        return True
