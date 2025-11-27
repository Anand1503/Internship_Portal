"""
Resume Analysis Model
Stores AI-generated analysis results for student resumes
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from ..database import Base


class AnalysisStatus(str, enum.Enum):
    """Analysis status enumeration"""
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"


class ResumeAnalysis(Base):
    """
    Resume Analysis model for storing AI-generated resume feedback
    
    Attributes:
        id: UUID primary key
        resume_id: Foreign key to Resume table
        score: Resume quality score (0-100)
        strengths: List of resume strengths (JSON array)
        missing_skills: List of missing/recommended skills (JSON array)
        suggestions: List of improvement suggestions (JSON array)
        status: Analysis status (pending/success/failed)
        error_message: Error details if analysis failed
        analyzed_at: Timestamp when analysis completed
        created_at: Timestamp when analysis was requested
    """
    __tablename__ = "resume_analysis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Integer, nullable=True)  # 0-100
    strengths = Column(JSON, nullable=True)  # List of strings
    missing_skills = Column(JSON, nullable=True)  # List of strings
    suggestions = Column(JSON, nullable=True)  # List of strings
    status = Column(SQLEnum(AnalysisStatus), default=AnalysisStatus.PENDING, nullable=False, index=True)
    error_message = Column(Text, nullable=True)
    analyzed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    resume = relationship("Resume", back_populates="analyses")

    def __repr__(self):
        return f"<ResumeAnalysis(id={self.id}, resume_id={self.resume_id}, status={self.status}, score={self.score})>"

    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            "id": str(self.id),
            "resume_id": self.resume_id,
            "score": self.score,
            "strengths": self.strengths,
            "missing_skills": self.missing_skills,
            "suggestions": self.suggestions,
            "status": self.status.value if self.status else None,
            "error_message": self.error_message,
            "analyzed_at": self.analyzed_at.isoformat() if self.analyzed_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
