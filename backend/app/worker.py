from celery import Celery
from celery.schedules import crontab
from datetime import date
from sqlalchemy.orm import Session
from .config import settings
from .database import SessionLocal
from .models import User, JournalEntry
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

# --- CELERY BEAT SCHEDULE ---
celery_app.conf.beat_schedule = {
    # Run the daily recap every night at 23:00 UTC
    "send_daily_recap": {
        "task": "daily_recap_task",
        "schedule": crontab(hour=23, minute=0),
    },
    # Run the nudge reminder every night at 20:00 UTC
    "send_missing_entry_reminder": {
        "task": "missing_entry_reminder_task",
        "schedule": crontab(hour=20, minute=0),
    },
}

@celery_app.task(name="send_test_email_task")
def send_test_email_task(to_email: str):
    subject = "Welcome to LogPulse Phase 2!"
    body = "This is a test email dispatched by our shiny new Celery worker."
    send_email(to_email, subject, body)
    return {"status": "success", "to": to_email}

@celery_app.task(name="daily_recap_task")
def daily_recap_task():
    db: Session = SessionLocal()
    try:
        today = date.today()
        # Find all entries for today
        entries = db.query(JournalEntry).filter(JournalEntry.date == today).all()
        
        emails_sent = 0
        for entry in entries:
            user = db.query(User).filter(User.id == entry.user_id).first()
            if not user:
                continue
                
            subject = f"LogPulse: Your Daily Recap for {today}"
            body = (
                f"Hello!\n\nHere is your recap for {today}:\n"
                f"- Meditation: {entry.meditation_mins} mins\n"
                f"- Reading: {entry.reading_mins} mins\n"
                f"- Sport: {entry.sport_mins} mins ({entry.sport_type or 'N/A'})\n"
                f"- Oral Practice: {entry.oral_mins} mins ({entry.oral_type or 'N/A'})\n"
                f"- Writing: {entry.writing_mins} mins\n\n"
                f"Great job staying consistent!"
            )
            send_email(user.email, subject, body)
            emails_sent += 1
            
        return {"status": "success", "emails_sent": emails_sent}
    finally:
        db.close()

@celery_app.task(name="missing_entry_reminder_task")
def missing_entry_reminder_task():
    db: Session = SessionLocal()
    try:
        today = date.today()
        
        # Get IDs of users who have an entry today
        users_with_entries = db.query(JournalEntry.user_id).filter(JournalEntry.date == today).subquery()
        
        # Find users whose ID is NOT in the list above
        missing_users = db.query(User).filter(User.id.notin_(users_with_entries)).all()
        
        emails_sent = 0
        for user in missing_users:
            subject = "LogPulse: Don't forget your daily journal!"
            body = "Hello!\n\nWe noticed you haven't logged your daily habits today. Take 5 minutes to keep your streak alive!\n\n- The LogPulse Team"
            send_email(user.email, subject, body)
            emails_sent += 1
            
        return {"status": "success", "reminders_sent": emails_sent}
    finally:
        db.close()
