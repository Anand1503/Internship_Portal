"""
Resume Analyzer Service
Business logic for AI-powered resume analysis
"""
import logging
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from uuid import UUID

from ..models.resume import Resume
from ..models.resume_analysis import ResumeAnalysis, AnalysisStatus
from ..schemas.resume_analysis import ResumeAnalysisRead, AnalysisResultUpdate
from ..utils.pdf_extractor import extract_text_from_pdf, validate_resume_text
from ..utils.ai_client import create_ai_client, AIClientError

logger = logging.getLogger(__name__)


class ResumeAnalyzerService:
    """Service for managing resume analysis operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def enqueue_resume_analysis(self, resume_id: int, user_id: int) -> ResumeAnalysis:
        """
        Create a new resume analysis request with pending status.
        
        Args:
            resume_id: ID of the resume to analyze
            user_id: ID of the user requesting analysis
            
        Returns:
            Created ResumeAnalysis record
            
        Raises:
            ValueError: If resume not found or doesn't belong to user
        """
        # Verify resume exists and belongs to user
        resume = self.db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == user_id
        ).first()
        
        if not resume:
            raise ValueError("Resume not found or access denied")
        
        # Create pending analysis record
        analysis = ResumeAnalysis(
            resume_id=resume_id,
            status=AnalysisStatus.PENDING
        )
        
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        
        logger.info(f"Created analysis {analysis.id} for resume {resume_id}")
        return analysis
    
    def perform_resume_analysis(self, analysis_id: UUID) -> ResumeAnalysis:
        """
        Perform the actual AI analysis on a resume (called by background task).
        
        This is the main analysis workflow:
        1. Load resume metadata
        2. Extract text from PDF
        3. Call AI service
        4. Store results
        
        Args:
            analysis_id: UUID of the analysis record
            
        Returns:
            Updated ResumeAnalysis record
        """
        # Load analysis record
        analysis = self.db.query(ResumeAnalysis).filter(
            ResumeAnalysis.id == analysis_id
        ).first()
        
        if not analysis:
            logger.error(f"Analysis {analysis_id} not found")
            raise ValueError("Analysis not found")
        
        try:
            logger.info(f"Starting analysis {analysis_id} for resume {analysis.resume_id}")
            
            # Step 1: Load resume
            resume = self.db.query(Resume).filter(Resume.id == analysis.resume_id).first()
            if not resume:
                raise ValueError("Resume not found")
            
            # Step 2: Extract PDF text
            logger.info(f"Extracting text from PDF: {resume.file_path}")
            resume_text = extract_text_from_pdf(resume.file_path)
            
            # Validate extracted text
            if not validate_resume_text(resume_text):
                raise ValueError("Invalid or insufficient resume text extracted")
            
            logger.info(f"Extracted {len(resume_text)} characters from resume")
            
            # Step 3: Call AI service
            ai_client = create_ai_client()
            analysis_result = ai_client.analyze_resume(resume_text)
            
            # Step 4: Store results
            analysis.score = int(analysis_result["score"])
            analysis.strengths = analysis_result["strengths"]
            analysis.missing_skills = analysis_result.get("missing_skills", [])
            analysis.suggestions = analysis_result["suggestions"]
            analysis.status = AnalysisStatus.SUCCESS
            analysis.analyzed_at = datetime.utcnow()
            analysis.error_message = None
            
            self.db.commit()
            self.db.refresh(analysis)
            
            logger.info(f"Analysis {analysis_id} completed successfully with score {analysis.score}")
            return analysis
            
        except Exception as e:
            logger.error(f"Analysis {analysis_id} failed: {e}", exc_info=True)
            
            # Store error state
            analysis.status = AnalysisStatus.FAILED
            analysis.error_message = str(e)
            analysis.analyzed_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(analysis)
            
            return analysis
    
    def get_analysis_by_id(self, analysis_id: UUID, user_id: Optional[int] = None) -> Optional[ResumeAnalysis]:
        """
        Get analysis by ID with optional user access check.
        
        Args:
            analysis_id: UUID of the analysis
            user_id: Optional user ID for access control
            
        Returns:
            ResumeAnalysis or None
        """
        query = self.db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id)
        
        # Join with resume to check user ownership if user_id provided
        if user_id is not None:
            query = query.join(Resume).filter(Resume.user_id == user_id)
        
        return query.first()
    
    def get_resume_analyses(self, resume_id: int, user_id: Optional[int] = None) -> List[ResumeAnalysis]:
        """
        Get all analyses for a resume.
        
        Args:
            resume_id: ID of the resume
            user_id: Optional user ID for access control
            
        Returns:
            List of ResumeAnalysis records
        """
        query = self.db.query(ResumeAnalysis).filter(ResumeAnalysis.resume_id == resume_id)
        
        # Check user ownership if user_id provided
        if user_id is not None:
            resume = self.db.query(Resume).filter(
                Resume.id == resume_id,
                Resume.user_id == user_id
            ).first()
            if not resume:
                return []
        
        return query.order_by(ResumeAnalysis.created_at.desc()).all()
    
    def rescan_analysis(self, analysis_id: UUID, user_id: int) -> ResumeAnalysis:
        """
        Reset an analysis to pending status for re-scanning.
        
        Args:
            analysis_id: UUID of the analysis to rescan
            user_id: User ID for access control
            
        Returns:
            Updated ResumeAnalysis record
            
        Raises:
            ValueError: If analysis not found or access denied
        """
        # Get analysis with user access check
        analysis = self.get_analysis_by_id(analysis_id, user_id)
        
        if not analysis:
            raise ValueError("Analysis not found or access denied")
        
        # Reset to pending
        analysis.status = AnalysisStatus.PENDING
        analysis.score = None
        analysis.strengths = None
        analysis.missing_skills = None
        analysis.suggestions = None
        analysis.error_message = None
        analysis.analyzed_at = None
        
        self.db.commit()
        self.db.refresh(analysis)
        
        logger.info(f"Reset analysis {analysis_id} to pending for rescan")
        return analysis
    
    def get_latest_analysis_for_resume(self, resume_id: int) -> Optional[ResumeAnalysis]:
        """
        Get the most recent successful analysis for a resume.
        
        Args:
            resume_id: ID of the resume
            
        Returns:
            Latest successful ResumeAnalysis or None
        """
        return self.db.query(ResumeAnalysis).filter(
            ResumeAnalysis.resume_id == resume_id,
            ResumeAnalysis.status == AnalysisStatus.SUCCESS
        ).order_by(ResumeAnalysis.analyzed_at.desc()).first()
