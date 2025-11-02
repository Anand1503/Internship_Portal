from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ApplicationBase(BaseModel):
    cover_letter: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    internship_id: int
    resume_id: int


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    cover_letter: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    internship_id: int
    internship_title: str
    company_name: str  # Changed from internship_company to match frontend
    resume_id: int
    resume_title: str
    cover_letter: Optional[str] = None
    status: str
    applied_at: datetime

    model_config = {"from_attributes": True}


class ApplicationList(BaseModel):
    applications: list[ApplicationOut]
    total: int


class ApplicationStatus(BaseModel):
    status: str  # 'pending', 'accepted', 'rejected', 'withdrawn'
