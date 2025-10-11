from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:YourNewPassword@localhost:5432/internship_portal"
    SECRET_KEY: str = "yge_Ja7CUnsQLzsoqOlua37hJHDLGO3E53gdoJJxAZw"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RESUME_UPLOAD_DIR: str = "resumes"
    FRONTEND_URL: str = "http://localhost:5173"  # Default for dev

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        model_config = {"extra": "ignore"}


settings = Settings()
