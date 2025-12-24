from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

from srcs.models.report import AccidentReportDraft
from srcs.models.enums import SessionStatus


class AccidentSession(SQLModel, table=True):
    id: str = Field(primary_key=True)  # UUID
    otp: str # 6 digit code for joining
    
    # Participants
    driver_a_id: str | None = Field(default=None, foreign_key="user.id")
    driver_b_id: str | None = Field(default=None, foreign_key="user.id")
    police_id: str | None = Field(default=None, foreign_key="user.id")

    # once both draft is set/submitted, create an accident report automatically
    driver_a_draft_id: int | None = Field(default=None, foreign_key="accidentreportdraft.id")
    driver_b_draft_id: int | None = Field(default=None, foreign_key="accidentreportdraft.id")
    final_report_id: int | None = Field(default=None, foreign_key="accidentreport.id")

    meet_link: str | None = None
    status: SessionStatus = Field(default=SessionStatus.CREATED)
    created_at: datetime = Field(default_factory=datetime.utcnow)
