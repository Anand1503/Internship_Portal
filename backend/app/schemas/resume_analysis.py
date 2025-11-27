"""
Pydantic schemas for Resume Analysis API
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum
from uuid import UUID


class AnalysisStatus(str, Enum):
    """Analysis status enumeration"""
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"


class ResumeAnalysisCreate(BaseModel):
    """Schema for creating a new resume analysis"""
    resume_id: int = Field(..., description="ID of the resume to analyze")


class ResumeAnalysisRead(BaseModel):
    """Schema for reading resume analysis results"""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID = Field(..., description="UUID of the analysis")
    resume_id: int = Field(..., description="ID of the resume")
    score: Optional[int] = Field(None, ge=0, le=100, description="Resume quality score (0-100)")
    strengths: Optional[List[str]] = Field(None, description="List of resume strengths")
    missing_skills: Optional[List[str]] = Field(None, description="List of missing or recommended skills")
    suggestions: Optional[List[str]] = Field(None, description="List of actionable improvement suggestions")
    status: str = Field(..., description="Analysis status (pending/success/failed)")
    error_message: Optional[str] = Field(None, description="Error message if analysis failed")
    analyzed_at: Optional[datetime] = Field(None, description="Timestamp when analysis completed")
    created_at: datetime = Field(..., description="Timestamp when analysis was requested")


class ResumeAnalysisListItem(BaseModel):
    """Minimal schema for listing analyses"""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    resume_id: int
    score: Optional[int] = None
    status: str
    analyzed_at: Optional[datetime] = None
    created_at: datetime


class AnalysisResultUpdate(BaseModel):
    """Schema for updating analysis results (used by AI service)"""
    score: int = Field(..., ge=0, le=100)
    strengths: List[str] = Field(..., min_length=1)
    missing_skills: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(..., min_length=1)
