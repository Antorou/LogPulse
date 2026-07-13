import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .config import settings

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg["From"] = "no-reply@logpulse.local"
    msg["To"] = to_email
    msg["Subject"] = subject
    
    msg.attach(MIMEText(body, "plain"))
    
    try:
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            # We don't need authentication or TLS for our local Mailpit instance
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
