"""
Unit tests for Resume Analyzer Service
Tests PDF extraction, AI analysis, and database operations
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from uuid import uuid4
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis, AnalysisStatus
from app.services.resume_analyzer import ResumeAnalyzerService
from app.utils.ai_client import AIClientError


@pytest.fixture
def mock_db():
    """Mock database session"""
    return MagicMock(spec=Session)


@pytest.fixture
def sample_resume(mock_db):
    """Sample resume for testing"""
    resume = Resume(
        id=1,
        user_id=100,
        title="Software Engineer Resume",
        file_path="/path/to/resume.pdf",
        created_at=datetime.utcnow()
    )
    return resume


@pytest.fixture
def sample_analysis_result():
    """Sample AI analysis result"""
    return {
        "score": 82,
        "strengths": [
            "Strong technical skills in Python and JavaScript",
            "Multiple relevant projects demonstrating practical experience",
            "Clear and well-structured layout"
        ],
        "missing_skills": [
            "Cloud platforms (AWS/Azure/GCP)",
            "System design experience"
        ],
        "suggestions": [
            "Add quantifiable achievements",
            "Include more action verbs",
            "Add a brief summary section"
        ]
    }


class TestResumeAnalyzerService:
    """Test suite for ResumeAnalyzerService"""
    
    def test_enqueue_resume_analysis_success(self, mock_db, sample_resume):
        """Test creating a new analysis request"""
        # Setup
        mock_db.query.return_value.filter.return_value.first.return_value = sample_resume
        service = ResumeAnalyzerService(mock_db)
        
        # Execute
        analysis = service.enqueue_resume_analysis(resume_id=1, user_id=100)
        
        # Verify
        assert analysis.resume_id == 1
        assert analysis.status == AnalysisStatus.PENDING
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
    
    def test_enqueue_resume_analysis_not_found(self, mock_db):
        """Test enqueueing analysis for non-existent resume"""
        # Setup
        mock_db.query.return_value.filter.return_value.first.return_value = None
        service = ResumeAnalyzerService(mock_db)
        
        # Execute & Verify
        with pytest.raises(ValueError, match="Resume not found"):
            service.enqueue_resume_analysis(resume_id=999, user_id=100)
    
    @patch('app.services.resume_analyzer.extract_text_from_pdf')
    @patch('app.services.resume_analyzer.create_ai_client')
    def test_perform_resume_analysis_success(
        self,
        mock_create_ai_client,
        mock_extract_pdf,
        mock_db,
        sample_resume,
        sample_analysis_result
    ):
        """Test successful resume analysis workflow"""
        # Setup
        analysis_id = uuid4()
        analysis = ResumeAnalysis(
            id=analysis_id,
            resume_id=1,
            status=AnalysisStatus.PENDING
        )
        
        mock_db.query.return_value.filter.return_value.first.side_effect = [
            analysis,  # First call for analysis
            sample_resume  # Second call for resume
        ]
        
        mock_extract_pdf.return_value = "This is a sample resume text with experience and skills. It needs to be longer than 100 characters to pass the validation check in the service. So I am adding more text here to ensure it passes the length check."
        
        mock_ai_client = Mock()
        mock_ai_client.analyze_resume.return_value = sample_analysis_result
        mock_create_ai_client.return_value = mock_ai_client
        
        service = ResumeAnalyzerService(mock_db)
        
        # Execute
        result = service.perform_resume_analysis(analysis_id)
        
        # Verify
        assert result.status == AnalysisStatus.SUCCESS
        assert result.score == 82
        assert len(result.strengths) == 3
        assert len(result.missing_skills) == 2
        assert len(result.suggestions) == 3
        assert result.analyzed_at is not None
        mock_db.commit.assert_called()
    
    @patch('app.services.resume_analyzer.extract_text_from_pdf')
    @patch('app.services.resume_analyzer.create_ai_client')
    def test_perform_resume_analysis_ai_failure(
        self,
        mock_create_ai_client,
        mock_extract_pdf,
        mock_db,
        sample_resume
    ):
        """Test analysis failure when AI service fails"""
        # Setup
        analysis_id = uuid4()
        analysis = ResumeAnalysis(
            id=analysis_id,
            resume_id=1,
            status=AnalysisStatus.PENDING
        )
        
        mock_db.query.return_value.filter.return_value.first.side_effect = [
            analysis,
            sample_resume
        ]
        
        mock_extract_pdf.return_value = "This is a sample resume text with experience and skills. It needs to be longer than 100 characters to pass the validation check in the service. So I am adding more text here to ensure it passes the length check."
        
        mock_ai_client = Mock()
        mock_ai_client.analyze_resume.side_effect = AIClientError("API rate limit exceeded")
        mock_create_ai_client.return_value = mock_ai_client
        
        service = ResumeAnalyzerService(mock_db)
        
        # Execute
        result = service.perform_resume_analysis(analysis_id)
        
        # Verify
        assert result.status == AnalysisStatus.FAILED
        assert "API rate limit exceeded" in result.error_message
        assert result.score is None
    
    @patch('app.services.resume_analyzer.extract_text_from_pdf')
    def test_perform_resume_analysis_pdf_extraction_failure(
        self,
        mock_extract_pdf,
        mock_db,
        sample_resume
    ):
        """Test analysis failure when PDF extraction fails"""
        # Setup
        analysis_id = uuid4()
        analysis = ResumeAnalysis(
            id=analysis_id,
            resume_id=1,
            status=AnalysisStatus.PENDING
        )
        
        mock_db.query.return_value.filter.return_value.first.side_effect = [
            analysis,
            sample_resume
        ]
        
        mock_extract_pdf.side_effect = ValueError("Failed to extract text from PDF")
        
        service = ResumeAnalyzerService(mock_db)
        
        # Execute
        result = service.perform_resume_analysis(analysis_id)
        
        # Verify
        assert result.status == AnalysisStatus.FAILED
        assert "Failed to extract text" in result.error_message
    
    def test_get_analysis_by_id(self, mock_db):
        """Test retrieving analysis by ID"""
        # Setup
        analysis_id = uuid4()
        expected_analysis = ResumeAnalysis(id=analysis_id, resume_id=1)
        mock_db.query.return_value.filter.return_value.first.return_value = expected_analysis
        
        service = ResumeAnalyzerService(mock_db)
        
        # Execute
        result = service.get_analysis_by_id(analysis_id)
        
        # Verify
        assert result == expected_analysis
    
    def test_get_resume_analyses(self, mock_db):
        """Test listing all analyses for a resume"""
        # Setup
        analyses = [
            ResumeAnalysis(id=uuid4(), resume_id=1, score=85),
            ResumeAnalysis(id=uuid4(), resume_id=1, score=78)
        ]
        mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = analyses
        mock_db.query.return_value.filter.return_value.first.return_value = Mock(id=1, user_id=100)
        
        service = ResumeAnalyzerService(mock_db)
        
        # Execute
        result = service.get_resume_analyses(resume_id=1, user_id=100)
        
        # Verify
        assert len(result) == 2
        assert result[0].score == 85
    
    def test_rescan_analysis(self, mock_db, sample_resume):
        """Test rescanning an existing analysis"""
        # Setup
        analysis_id = uuid4()
        analysis = ResumeAnalysis(
            id=analysis_id,
            resume_id=1,
            status=AnalysisStatus.SUCCESS,
            score=75,
            strengths=["Old strength"],
            suggestions=["Old suggestion"]
        )
        analysis.resume = sample_resume
        
        mock_db.query.return_value.filter.return_value.join.return_value.filter.return_value.first.return_value = analysis
        
        service = ResumeAnalyzerService(mock_db)
        
        # Execute
        result = service.rescan_analysis(analysis_id, user_id=100)
        
        # Verify
        assert result.status == AnalysisStatus.PENDING
        assert result.score is None
        assert result.strengths is None
        assert result.suggestions is None
        mock_db.commit.assert_called_once()
