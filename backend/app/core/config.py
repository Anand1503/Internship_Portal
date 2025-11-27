from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/internship_portal"
    
    # Security
    SECRET_KEY: str = "yge_Ja7CUnsQLzsoqOlua37hJHDLGO3E53gdoJJxAZw"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:8000"]
    
    # File Upload
    RESUME_UPLOAD_DIR: str = "resumes"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["application/pdf"]
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Internship Portal API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API for Internship Portal - A platform for students to apply for internships and HR to manage applications"
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Email (for future use)
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = ""
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = ""
    EMAILS_FROM_NAME: str = "Internship Portal"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # AI Resume Analyzer
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    ANALYZER_TIMEOUT_SECONDS: int = 60



    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
        "case_sensitive": True
    }


settings = Settings()
