from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserOut] = None

class ResumeBase(BaseModel):
    title: str
    file_path: str

class ResumeCreate(BaseModel):
    title: str

class ResumeResponse(ResumeBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

ResumeOut = ResumeResponse

class InternshipCreate(BaseModel):
    title: str
    company_name: str
    location: str
    stipend: Optional[float] = None
    description: str
    min_qualifications: Optional[str] = None
    expected_qualifications: Optional[str] = None
    deadline: datetime

class InternshipOut(BaseModel):
    id: int
    title: str
    company_name: str
    location: str
    stipend: Optional[float] = None
    description: str
    min_qualifications: Optional[str] = None
    expected_qualifications: Optional[str] = None
    deadline: datetime
    posted_at: datetime
    posted_by_name: str

    model_config = {"from_attributes": True}

class ApplicationCreate(BaseModel):
    internship_id: int
    resume_id: int
    cover_letter: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    internship_id: int
    internship_title: str
    internship_company: str
    resume_id: int
    resume_title: str
    cover_letter: Optional[str] = None
    status: str
    applied_at: datetime

    model_config = {"from_attributes": True}
