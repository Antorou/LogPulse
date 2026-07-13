from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from uuid import UUID

from ..database import get_db
from ..models import User, JournalEntry
from ..schemas import JournalEntryCreate, JournalEntryUpdate, JournalEntryResponse
from ..auth import get_current_user

router = APIRouter(
    prefix="/journals",
    tags=["Journaling"]
)

@router.post("/", response_model=JournalEntryResponse, status_code=status.HTTP_201_CREATED)
def create_journal_entry(
    entry_in: JournalEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        new_entry = JournalEntry(**entry_in.model_dump(), user_id=current_user.id)
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)
        return new_entry
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A journal entry for this date already exists for this user."
        )

@router.get("/", response_model=List[JournalEntryResponse])
def get_journal_entries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entries = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).order_by(JournalEntry.date.desc()).all()
    return entries

@router.put("/{entry_id}", response_model=JournalEntryResponse)
def update_journal_entry(
    entry_id: UUID,
    entry_update: JournalEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id, 
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    update_data = entry_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(entry, key, value)
        
    db.commit()
    db.refresh(entry)
    return entry
