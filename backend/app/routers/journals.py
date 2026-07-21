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

@router.get("/stats")
def get_journal_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from datetime import date, timedelta
    
    entries = db.query(JournalEntry.date).filter(JournalEntry.user_id == current_user.id).order_by(JournalEntry.date.desc()).all()
    
    if not entries:
        return {"current_streak": 0, "longest_streak": 0, "total_entries": 0}

    dates = [e.date for e in entries]
    current_streak = 0
    longest_streak = 1
    temp_streak = 1
    today = date.today()
    
    # Calculate current streak
    if dates[0] == today or dates[0] == today - timedelta(days=1):
        current_streak = 1
        for i in range(1, len(dates)):
            if dates[i-1] - dates[i] == timedelta(days=1):
                current_streak += 1
            elif dates[i-1] == dates[i]:
                continue
            else:
                break
                
    # Calculate longest streak
    for i in range(1, len(dates)):
        if dates[i-1] - dates[i] == timedelta(days=1):
            temp_streak += 1
        elif dates[i-1] == dates[i]:
            continue
        else:
            if temp_streak > longest_streak:
                longest_streak = temp_streak
            temp_streak = 1
    if temp_streak > longest_streak:
        longest_streak = temp_streak

    return {
        "current_streak": current_streak,
        "longest_streak": max(current_streak, longest_streak),
        "total_entries": len(dates)
    }

from fastapi import UploadFile, File
from ..s3 import upload_image
from uuid import UUID
import uuid

@router.post("/{entry_id}/image", response_model=JournalEntryResponse)
def upload_journal_image(
    entry_id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
        
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type")
        
    file_extension = file.filename.split(".")[-1]
    filename = f"{current_user.id}/{entry.id}_{uuid.uuid4()}.{file_extension}"
    image_url = upload_image(file.file, filename, file.content_type)
    
    entry.image_url = image_url
    db.commit()
    db.refresh(entry)
    return entry

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

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journal_entry(
    entry_id: UUID,
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
        
    db.delete(entry)
    db.commit()
