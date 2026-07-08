import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/suyogya")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-sbi-suyogya-key-9042")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 Hours

    class Config:
        case_sensitive = True

settings = Settings()
