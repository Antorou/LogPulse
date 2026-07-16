from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID
from datetime import datetime, date

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    goals: str | None = None
    pseudo: str | None = None

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    goals: str | None = None
    pseudo: str | None = None
    
    model_config = ConfigDict(from_attributes=True)

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: str | None = None

# --- Journal Entry Schemas ---
class JournalEntryBase(BaseModel):
    date: date
    meditation_mins: int = 0
    reading_mins: int = 0
    reading_book: str | None = None
    reading_notes: str | None = None
    sport_type: str | None = None
    sport_mins: int = 0
    oral_type: str | None = None
    oral_mins: int = 0
    writing_mins: int = 0

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryUpdate(BaseModel):
    meditation_mins: int | None = None
    reading_mins: int | None = None
    reading_book: str | None = None
    reading_notes: str | None = None
    sport_type: str | None = None
    sport_mins: int | None = None
    oral_type: str | None = None
    oral_mins: int | None = None
    writing_mins: int | None = None

class JournalEntryResponse(JournalEntryBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
