from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class AccidentSession(SQLModel, table=True):
    id: str = Field(primary_key=True)  # UUID
    otp: str # 6 digit code for joining
    
    # Participants
    driver_a_id: str | None = Field(default=None, foreign_key="user.id")
    driver_b_id: str | None = Field(default=None, foreign_key="user.id")
    police_id: str | None = Field(default=None, foreign_key="user.id")
    
    # State Flow
    status: str = Field(default="CREATED") 
    # Statuses: CREATED, HANDSHAKE_COMPLETE, SUBMITTED_A, SUBMITTED_B, PENDING_POLICE, MEETING_STARTED, POLICE_SIGNED, CASE_CLOSED
    
    meet_link: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
