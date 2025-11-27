"""
PDF Text Extraction Utilities
Extracts text from PDF files using pypdf with pdfminer.six fallback
"""
import logging
from typing import Optional
from pathlib import Path

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text content from a PDF file.
    
    Uses pypdf as primary method with pdfminer.six as fallback.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Extracted text content as string
        
    Raises:
        FileNotFoundError: If PDF file doesn't exist
        ValueError: If text extraction fails or yields insufficient text
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {file_path}")
    
    # Try pypdf first (modern, fast)
    try:
        text = _extract_with_pypdf(file_path)
        if text and len(text.strip()) > 100:  # Sanity check: at least 100 chars
            logger.info(f"Successfully extracted {len(text)} characters using pypdf")
            return text
    except Exception as e:
        logger.warning(f"pypdf extraction failed: {e}, trying fallback method")
    
    # Fallback to pdfminer.six (more robust for complex PDFs)
    try:
        text = _extract_with_pdfminer(file_path)
        if text and len(text.strip()) > 100:
            logger.info(f"Successfully extracted {len(text)} characters using pdfminer.six")
            return text
    except Exception as e:
        logger.error(f"pdfminer.six extraction failed: {e}")
        raise ValueError(f"Failed to extract text from PDF: {e}")
    
    raise ValueError("PDF text extraction yielded insufficient content")


def _extract_with_pypdf(file_path: str) -> str:
    """Extract text using pypdf library"""
    try:
        from pypdf import PdfReader
    except ImportError:
        raise ImportError("pypdf not installed. Run: pip install pypdf")
    
    reader = PdfReader(file_path)
    text_parts = []
    
    for page_num, page in enumerate(reader.pages):
        try:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        except Exception as e:
            logger.warning(f"Failed to extract page {page_num}: {e}")
            continue
    
    return "\n\n".join(text_parts)


def _extract_with_pdfminer(file_path: str) -> str:
    """Extract text using pdfminer.six library (fallback)"""
    try:
        from pdfminer.high_level import extract_text as pdfminer_extract
    except ImportError:
        raise ImportError("pdfminer.six not installed. Run: pip install pdfminer.six")
    
    text = pdfminer_extract(file_path)
    return text


def validate_resume_text(text: str, min_length: int = 100) -> bool:
    """
    Validate that extracted text is sufficient for analysis.
    
    Args:
        text: Extracted text
        min_length: Minimum character count
        
    Returns:
        True if text is valid
    """
    if not text or not text.strip():
        return False
    
    if len(text.strip()) < min_length:
        logger.warning(f"Extracted text too short: {len(text)} chars")
        return False
    
    # Check for common resume keywords (basic heuristic)
    resume_keywords = ['experience', 'education', 'skills', 'work', 'project', 'degree']
    text_lower = text.lower()
    keyword_count = sum(1 for kw in resume_keywords if kw in text_lower)
    
    if keyword_count == 0:
        logger.warning("No common resume keywords found in text")
        return False
    
    return True
