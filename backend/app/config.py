from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/logpulse"
    SECRET_KEY: str = "super-secret-key-for-local-dev-only-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    
    REDIS_URL: str = "redis://localhost:6379/0"
    SMTP_SERVER: str = "localhost"
    SMTP_PORT: int = 1025
    
    class Config:
        env_file = ".env"

settings = Settings()
