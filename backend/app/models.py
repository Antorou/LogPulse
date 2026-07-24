import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    pseudo = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    goals = Column(String, nullable=True)
    
    entries = relationship("JournalEntry", back_populates="user")

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    date = Column(Date, default=date.today, nullable=False)
    meditation_mins = Column(Integer, default=0)
    reading_mins = Column(Integer, default=0)
    reading_book = Column(String, nullable=True)
    reading_notes = Column(String, nullable=True)
    sport_type = Column(String, nullable=True)
    sport_mins = Column(Integer, default=0)
    oral_type = Column(String, nullable=True)
    oral_mins = Column(Integer, default=0)
    writing_mins = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="entries")

    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='uq_user_date'),
    )
