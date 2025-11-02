from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ResumeBase(BaseModel):
    title: str


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(BaseModel):
    title: Optional[str] = None


class ResumeOut(ResumeBase):
    id: int
    file_path: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ResumeResponse(ResumeOut):
    pass  # For backward compatibility
