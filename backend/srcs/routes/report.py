from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel

from srcs.database import get_session
from srcs.models.session import AccidentSession
from srcs.models.report import AccidentReport, Evidence, EvidenceType
from srcs.models.enums import SessionStatus, EvidenceTag
from srcs.services.event_service import event_manager

router = APIRouter(prefix="/report", tags=["Report"])

class EvidenceItem(BaseModel):
    type: EvidenceType
    tag: EvidenceTag
    title: str | None = None
    content: str # Base64/URL

class SubmitRequest(BaseModel):
    session_id: str
    user_id: str
    evidences: List[EvidenceItem]

@router.post("/submit")
async def submit_report(req: SubmitRequest, db: Session = Depends(get_session)):
    # 1. Create or Get AccidentReport (It might exist if the other user already submitted)
    stm = select(AccidentReport).where(AccidentReport.session_id == req.session_id)
    report = db.exec(stm).first()
    if not report:
        report = AccidentReport(session_id=req.session_id)
        db.add(report)
        db.commit()
        db.refresh(report)
    
    # 2. Add Evidence
    for item in req.evidences:
        final_title = item.title if item.title else item.tag.value
        ev = Evidence(
            report_id=report.id,
            uploader_id=req.user_id,
            type=item.type,
            tag=item.tag,
            title=final_title,
            content=item.content
        )
        db.add(ev)
    
    # 3. Update Session State logic
    session_obj = db.get(AccidentSession, req.session_id)
    
    # Simple logic: Check how many unique uploaders in Evidence for this report
    # If we have evidence from both drivers, we can mark as PENDING_POLICE
    # But for now, let's just use explicit flags or checking specific user submission
    
    # Optimization: Just query evidence uploaders
    db.commit() # Save evidence first
    
    check_stmt = select(Evidence.uploader_id).where(Evidence.report_id == report.id).distinct()
    uploaders = db.exec(check_stmt).all()
    
    state_update = "REPORT_SUBMITTED"
    
    if len(uploaders) >= 2: # Assuming A and B both submitted
        session_obj.status = SessionStatus.PENDING_POLICE
        state_update = "ALL_REPORTS_SUBMITTED"
    
    db.add(session_obj)
    db.commit()
    
    await event_manager.publish(req.session_id, state_update, {"user_id": req.user_id})
    return {"status": "SUBMITTED"}
