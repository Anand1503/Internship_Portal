"""
Resume Analysis API Router
Endpoints for AI-powered resume analysis
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..database import get_db, SessionLocal
from ..models.user import User
from ..dependencies import get_current_user
from ..schemas.resume_analysis import (
    ResumeAnalysisCreate,
    ResumeAnalysisRead,
    ResumeAnalysisListItem
)
from ..services.resume_analyzer import ResumeAnalyzerService

router = APIRouter()


def run_analysis_background(analysis_id: UUID):
    """Background task wrapper to ensure fresh DB session"""
    db = SessionLocal()
    try:
        service = ResumeAnalyzerService(db)
        service.perform_resume_analysis(analysis_id)
    finally:
        db.close()


@router.get("/test")
def test_endpoint():
    return {"message": "Resume Analysis Router is working"}

@router.post("/{resume_id}/analyze", response_model=ResumeAnalysisRead, status_code=status.HTTP_202_ACCEPTED)
async def start_resume_analysis(
    resume_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start AI analysis for a resume.
    
    Creates a pending analysis record and enqueues a background task.
    The analysis runs asynchronously and updates the record when complete.
    
    - **resume_id**: ID of the resume to analyze
    
    Returns the created analysis record with status 'pending'.
    Poll GET /api/v1/resumes/analysis/{analysis_id} to check status.
    """
    service = ResumeAnalyzerService(db)
    
    try:
        # Create pending analysis record
        analysis = service.enqueue_resume_analysis(resume_id, current_user.id)
        
        # Enqueue background task to perform analysis
        background_tasks.add_task(
            run_analysis_background,
            analysis.id
        )
        
        return ResumeAnalysisRead.model_validate(analysis)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start analysis: {str(e)}"
        )


@router.get("/{resume_id}/analysis", response_model=List[ResumeAnalysisListItem])
def list_resume_analyses(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all analyses for a specific resume.
    
    Returns analyses ordered by creation date (newest first).
    Only returns analyses for resumes owned by the current user.
    
    - **resume_id**: ID of the resume
    """
    service = ResumeAnalyzerService(db)
    analyses = service.get_resume_analyses(resume_id, current_user.id)
    
    return [ResumeAnalysisListItem.model_validate(a) for a in analyses]


@router.get("/analysis/{analysis_id}", response_model=ResumeAnalysisRead)
def get_analysis_details(
    analysis_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed analysis results.
    
    Returns full analysis including score, strengths, missing skills, and suggestions.
    Only accessible by the resume owner.
    
    - **analysis_id**: UUID of the analysis
    """
    service = ResumeAnalyzerService(db)
    analysis = service.get_analysis_by_id(analysis_id, current_user.id)
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or access denied"
        )
    
    return ResumeAnalysisRead.model_validate(analysis)


@router.post("/analysis/{analysis_id}/rescan", response_model=ResumeAnalysisRead, status_code=status.HTTP_202_ACCEPTED)
async def rescan_analysis(
    analysis_id: UUID,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Re-run analysis for an existing analysis record.
    
    Resets the analysis to pending status and enqueues a new background task.
    Useful for:
    - Updated resumes
    - Improved AI models
    - Failed analyses that need retry
    
    - **analysis_id**: UUID of the analysis to rescan
    """
    service = ResumeAnalyzerService(db)
    
    try:
        # Reset analysis to pending
        analysis = service.rescan_analysis(analysis_id, current_user.id)
        
        # Enqueue background task
        background_tasks.add_task(
            run_analysis_background,
            analysis.id
        )
        
        return ResumeAnalysisRead.model_validate(analysis)
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to rescan analysis: {str(e)}"
        )
