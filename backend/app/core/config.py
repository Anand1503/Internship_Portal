from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RESUME_UPLOAD_DIR: str = "resumes"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
