"""
AI Client for Resume Analysis
Integrates with Google Gemini API for AI-powered resume analysis
"""
import os
import json
import logging
from typing import Dict, Optional
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logger = logging.getLogger(__name__)


class AIClientError(Exception):
    """Custom exception for AI client errors"""
    pass


class AIClient:
    """
    AI client for resume analysis using Google Gemini.
    
    Supports structured resume analysis with retry logic and error handling.
    """
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-1.5-flash"):
        """
        Initialize AI client.
        
        Args:
            api_key: Google Gemini API key (defaults to GEMINI_API_KEY env var)
            model: Gemini model to use (default: gemini-1.5-flash for speed/cost)
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise AIClientError("GEMINI_API_KEY not found in environment variables")
        
        self.model = model
        self._client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Gemini client"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self._client = genai.GenerativeModel(self.model)
            logger.info(f"Initialized Gemini client with model: {self.model}")
        except ImportError:
            raise AIClientError(
                "google-generativeai not installed. Run: pip install google-generativeai"
            )
        except Exception as e:
            raise AIClientError(f"Failed to initialize Gemini client: {e}")
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type(AIClientError)
    )
    def analyze_resume(self, resume_text: str, role: Optional[str] = None) -> Dict:
        """
        Analyze resume text and return structured feedback.
        
        Args:
            resume_text: Extracted text from resume PDF
            role: Optional target job role for tailored analysis
            
        Returns:
            Dictionary with keys: score, strengths, missing_skills, suggestions
            
        Raises:
            AIClientError: If analysis fails or response is invalid
        """
        if not resume_text or len(resume_text.strip()) < 100:
            raise AIClientError("Resume text is too short or empty")
        
        prompt = self._build_analysis_prompt(resume_text, role)
        
        try:
            logger.info(f"Sending resume analysis request to Gemini ({len(resume_text)} chars)")
            
            # Generate content with Gemini
            response = self._client.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.3,  # Lower temperature for more consistent output
                    "top_p": 0.95,
                    "top_k": 40,
                    "max_output_tokens": 2048,
                }
            )
            
            # Extract text from response
            if not response or not response.text:
                raise AIClientError("Empty response from Gemini API")
            
            response_text = response.text.strip()
            logger.debug(f"Received response: {response_text[:200]}...")
            
            # Parse JSON response
            analysis_result = self._parse_response(response_text)
            
            # Validate response structure
            self._validate_analysis_result(analysis_result)
            
            logger.info(f"Successfully analyzed resume with score: {analysis_result.get('score')}")
            return analysis_result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            raise AIClientError(f"Invalid JSON response from AI: {e}")
        except Exception as e:
            logger.error(f"Resume analysis failed: {e}")
            raise AIClientError(f"Resume analysis failed: {e}")
    
    def _build_analysis_prompt(self, resume_text: str, role: Optional[str] = None) -> str:
        """Build the analysis prompt for Gemini"""
        role_context = f" for a {role} position" if role else " for software engineering, data science, or related technical internships"
        
        prompt = f"""You are an expert resume reviewer and career coach. Analyze the following resume{role_context}.

**RESUME TEXT:**
{resume_text}

**YOUR TASK:**
Provide a comprehensive analysis with the following:

1. **Score (0-100)**: Overall resume quality score based on:
   - Content clarity and structure
   - Relevant skills and technologies
   - Work experience and projects
   - Education and achievements
   - Formatting and presentation

2. **Strengths**: List 3-5 specific strengths (be concise, actionable bullets)

3. **Missing Skills**: List 3-5 skills or elements that would strengthen the resume{role_context}

4. **Suggestions**: Provide 5-7 actionable improvement suggestions

**IMPORTANT:** Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{{
  "score": 75,
  "strengths": [
    "Strong technical skills in Python and JavaScript",
    "Multiple relevant projects demonstrating practical experience",
    "Clear and well-structured layout"
  ],
  "missing_skills": [
    "Cloud platforms (AWS/Azure/GCP)",
    "System design experience",
    "Leadership or mentorship experience"
  ],
  "suggestions": [
    "Add quantifiable achievements (e.g., 'Improved performance by 30%')",
    "Include more action verbs (developed, architected, optimized)",
    "Add a brief summary section at the top",
    "Highlight specific technologies used in each project",
    "Include links to GitHub or portfolio"
  ]
}}

Respond with ONLY the JSON object, no other text."""
        
        return prompt
    
    def _parse_response(self, response_text: str) -> Dict:
        """Parse and clean JSON response from AI"""
        # Remove markdown code blocks if present
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0]
        
        # Clean up any remaining whitespace
        response_text = response_text.strip()
        
        # Parse JSON
        try:
            result = json.loads(response_text)
            return result
        except json.JSONDecodeError:
            # Try to extract JSON if there's extra text
            start = response_text.find("{")
            end = response_text.rfind("}") + 1
            if start != -1 and end > start:
                json_str = response_text[start:end]
                return json.loads(json_str)
            raise
    
    def _validate_analysis_result(self, result: Dict) -> None:
        """Validate that the analysis result has required fields"""
        required_fields = ["score", "strengths", "missing_skills", "suggestions"]
        
        for field in required_fields:
            if field not in result:
                raise AIClientError(f"Missing required field in response: {field}")
        
        # Validate score range
        score = result["score"]
        if not isinstance(score, (int, float)) or score < 0 or score > 100:
            raise AIClientError(f"Invalid score value: {score}")
        
        # Validate lists
        for list_field in ["strengths", "missing_skills", "suggestions"]:
            if not isinstance(result[list_field], list):
                raise AIClientError(f"{list_field} must be a list")
            if not result[list_field]:
                logger.warning(f"{list_field} is empty")


def create_ai_client() -> AIClient:
    """
    Factory function to create AI client instance.
    
    Uses environment variables for configuration:
    - GEMINI_API_KEY: Required API key
    - GEMINI_MODEL: Optional model name (default: gemini-1.5-flash)
    """
    from ..core.config import settings
    return AIClient(api_key=settings.GEMINI_API_KEY, model=settings.GEMINI_MODEL)

