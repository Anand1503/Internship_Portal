from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    location = Column(String, nullable=False)
    stipend = Column(Float, nullable=True)
    description = Column(Text, nullable=False)
    min_qualifications = Column(Text, nullable=True)
    expected_qualifications = Column(Text, nullable=True)
    deadline = Column(DateTime, nullable=False)
    posted_at = Column(DateTime, server_default=func.now())
    posted_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    company = relationship("Company", back_populates="internships")
    posted_by_user = relationship("User", back_populates="internships")
    applications = relationship("Application", back_populates="internship")

    def __repr__(self):
        return f"<Internship(id={self.id}, title={self.title}, company_id={self.company_id})>"
