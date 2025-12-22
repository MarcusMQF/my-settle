from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from enum import Enum

class EvidenceType(str, Enum):
    PHOTO = "PHOTO"
    VIDEO = "VIDEO"
    MAP_SKETCH = "MAP_SKETCH"
    TEXT = "TEXT"

class Evidence(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    report_id: int | None = Field(default=None, foreign_key="accidentreport.id")
    uploader_id: str = Field(foreign_key="user.id")
    type: EvidenceType
    content: str  # Base64 or URL
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AccidentReport(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    session_id: str = Field(foreign_key="accidentsession.id")
    
    # Signatures
    police_signature: str | None = None
    driver_a_signature: str | None = None
    driver_b_signature: str | None = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
