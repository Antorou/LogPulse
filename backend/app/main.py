from fastapi import FastAPI
from .database import engine, Base
from .routers import auth, journals

app = FastAPI(title="LogPulse API")

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
