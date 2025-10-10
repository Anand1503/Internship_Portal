from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.session import Base


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
    applications = relationship("Application", back_populates="user")
    internships = relationship("Internship", back_populates="posted_by")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    internships = relationship("Internship", back_populates="company")


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
    posted_by = relationship("User", back_populates="internships")
    applications = relationship("Application", back_populates="internship")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="resumes")
    applications = relationship("Application", back_populates="resume")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    cover_letter = Column(Text, nullable=True)
    status = Column(String, default="pending")  # 'pending', 'accepted', 'rejected'
    applied_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="applications")
    internship = relationship("Internship", back_populates="applications")
    resume = relationship("Resume", back_populates="applications")
