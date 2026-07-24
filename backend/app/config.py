from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:////data/logpulse.db"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    
    REDIS_URL: str = "redis://localhost:6379/0"
    SMTP_SERVER: str = "localhost"
    SMTP_PORT: int = 1025
    
    # Files
    STORAGE_DIR: str = "/data/media/logpulse"

    
    class Config:
        env_file = ".env"

settings = Settings()
