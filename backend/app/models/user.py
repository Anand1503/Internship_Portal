from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'student' or 'hr'
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    resumes = relationship("Resume", back_populates="user")
    applications = relationship("Application", foreign_keys="Application.user_id", back_populates="user")
    internships = relationship("Internship", back_populates="posted_by_user")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
