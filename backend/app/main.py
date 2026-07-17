from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, journals
from .s3 import init_s3_bucket

app = FastAPI(title="LogPulse API")

@app.on_event("startup")
def on_startup():
    init_s3_bucket()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(journals.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "LogPulse API"}

@app.post("/test-email")
def test_email(email: str):
    from .worker import send_test_email_task
    # .delay() is the Celery magic to send it to the background queue!
    send_test_email_task.delay(email)
    return {"message": "Email task dispatched to Celery background worker."}
