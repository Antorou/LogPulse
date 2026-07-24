from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import auth, journals
from .s3 import init_s3_bucket
from .limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from prometheus_fastapi_instrumentator import Instrumentator
from .config import settings
import os

app = FastAPI(title="LogPulse API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Ensure storage dir exists before mounting
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
app.mount("/logpulse", StaticFiles(directory=settings.STORAGE_DIR), name="logpulse")


# Instrument the FastAPI app and expose /metrics endpoint
Instrumentator().instrument(app).expose(app)

@app.on_event("startup")
def on_startup():
    init_s3_bucket()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://logpulse.local"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(journals.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "LogPulse API"}

@app.post("/test-email")
def test_email(email: str):
    from .worker import send_test_email_task
    # .delay() is the Celery magic to send it to the background queue!
    send_test_email_task.delay(email)
    return {"message": "Email task dispatched to Celery background worker."}
