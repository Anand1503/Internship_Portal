from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InternshipBase(BaseModel):
    title: str
    location: str
    stipend: Optional[float] = None
    description: str
    min_qualifications: Optional[str] = None
    expected_qualifications: Optional[str] = None
    deadline: datetime


class InternshipCreate(InternshipBase):
    company_name: str


class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    stipend: Optional[float] = None
    description: Optional[str] = None
    min_qualifications: Optional[str] = None
    expected_qualifications: Optional[str] = None
    deadline: Optional[datetime] = None


class InternshipOut(InternshipBase):
    id: int
    company_name: str
    posted_at: datetime
    posted_by_name: str

    model_config = {"from_attributes": True}


class InternshipList(BaseModel):
    internships: list[InternshipOut]
    total: int
