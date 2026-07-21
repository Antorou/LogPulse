from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/logpulse"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    
    REDIS_URL: str = "redis://localhost:6379/0"
    SMTP_SERVER: str = "localhost"
    SMTP_PORT: int = 1025
    
    S3_ENDPOINT: str = "http://minio:9000"
    S3_ACCESS_KEY: str
    S3_SECRET_KEY: str
    S3_BUCKET: str = "logpulse"
    
    class Config:
        env_file = ".env"

settings = Settings()
