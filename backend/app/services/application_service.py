from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.application import Application
from ..schemas.application import ApplicationCreate, ApplicationUpdate


class ApplicationService:
    def __init__(self, db: Session):
        self.db = db

    def get_application_by_id(self, application_id: int) -> Optional[Application]:
        return self.db.query(Application).filter(Application.id == application_id).first()

    def get_user_applications(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Application]:
        return (
            self.db.query(Application)
            .filter(Application.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_job_applications(self, internship_id: int, skip: int = 0, limit: int = 100) -> List[Application]:
        return (
            self.db.query(Application)
            .filter(Application.internship_id == internship_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_application(self, application: ApplicationCreate, user_id: int) -> Optional[Application]:
        # Check if user has already applied to this internship
        existing_application = (
            self.db.query(Application)
            .filter(
                Application.user_id == user_id,
                Application.internship_id == application.internship_id
            )
            .first()
        )
        
        if existing_application:
            return None
        
        db_application = Application(
            user_id=user_id,
            internship_id=application.internship_id,
            resume_id=application.resume_id,
            cover_letter=application.cover_letter,
            status="pending"
        )
        self.db.add(db_application)
        self.db.commit()
        self.db.refresh(db_application)
        return db_application

    def update_application(self, application_id: int, application_update: ApplicationUpdate, reviewed_by: int = None) -> Optional[Application]:
        db_application = self.get_application_by_id(application_id)
        if not db_application:
            return None
        
        update_data = application_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_application, field, value)
        
        if reviewed_by:
            db_application.reviewed_by = reviewed_by
        
        self.db.commit()
        self.db.refresh(db_application)
        return db_application

    def update_application_status(self, application_id: int, status: str, reviewed_by: int = None) -> Optional[Application]:
        return self.update_application(
            application_id, 
            ApplicationUpdate(status=status), 
            reviewed_by
        )

    def withdraw_application(self, application_id: int, user_id: int) -> Optional[Application]:
        db_application = (
            self.db.query(Application)
            .filter(
                Application.id == application_id,
                Application.user_id == user_id
            )
            .first()
        )
        
        if not db_application:
            return None
        
        db_application.status = "withdrawn"
        self.db.commit()
        self.db.refresh(db_application)
        return db_application

    def delete_application(self, application_id: int) -> bool:
        db_application = self.get_application_by_id(application_id)
        if not db_application:
            return False
        
        self.db.delete(db_application)
        self.db.commit()
        return True
