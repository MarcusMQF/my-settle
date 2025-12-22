from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel

from srcs.database import get_session
from srcs.models.session import AccidentSession
from srcs.models.report import AccidentReport
from srcs.services.event_service import event_manager

router = APIRouter(prefix="/police", tags=["Police"])

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_session)):
    # Return all sessions that are ready for police
    stm = select(AccidentSession).where(AccidentSession.status == "PENDING_POLICE")
    results = db.exec(stm).all()
    return results

@router.post("/meeting")
async def start_meeting(session_id: str, police_id: str, db: Session = Depends(get_session)):
    session_obj = db.get(AccidentSession, session_id)
    if not session_obj:
        raise HTTPException(404, "Session not found")
        
    # Generate Google Meet Link (Mocked)
    link = f"https://meet.google.com/mock-{session_id[:8]}"
    session_obj.meet_link = link
    session_obj.police_id = police_id
    session_obj.status = "MEETING_STARTED"
    
    db.add(session_obj)
    db.commit()
    
    await event_manager.publish(session_id, "MEETING_STARTED", {"link": link})
    return {"link": link}

@router.post("/sign")
async def sign_report_police(session_id: str, police_id: str, signature: str, db: Session = Depends(get_session)):
    stm = select(AccidentReport).where(AccidentReport.session_id == session_id)
    report = db.exec(stm).first()
    if not report:
        raise HTTPException(404, "Report not found")
        
    report.police_signature = signature
    db.add(report)
    
    session_obj = db.get(AccidentSession, session_id)
    session_obj.status = "POLICE_SIGNED"
    db.add(session_obj)
    
    db.commit()
    
    await event_manager.publish(session_id, "POLICE_SIGNED", {"status": "SIGNED", "police_id": police_id})
    return {"status": "SIGNED"}
