from celery import Celery
from .config import settings
from .email_utils import send_email

celery_app = Celery(
    "logpulse_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(name="send_test_email_task")
def send_test_email_task(to_email: str):
    subject = "Welcome to LogPulse Phase 2!"
    body = "This is a test email dispatched by our shiny new Celery worker."
    send_email(to_email, subject, body)
    return {"status": "success", "to": to_email}
