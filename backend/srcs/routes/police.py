from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel

from srcs.database import get_session
from srcs.models.session import AccidentSession
from srcs.models.report import AccidentReport
from srcs.services.event_service import event_manager

from srcs.services.pdf_service import PDFService
from srcs.models.report import PoliceReportDetails
from fastapi.responses import FileResponse
import os

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

pdf_service = PDFService()

@router.post("/reports/{session_id}/generate")
def generate_reports(session_id: str, data: PoliceReportDetails, db: Session = Depends(get_session)):
    # Upsert details
    existing = db.exec(select(PoliceReportDetails).where(PoliceReportDetails.session_id == session_id)).first()
    if existing:
        for key, value in data.dict(exclude_unset=True).items():
            setattr(existing, key, value)
        existing.session_id = session_id 
        db.add(existing)
        details = existing
    else:
        data.session_id = session_id
        db.add(data)
        details = data
    
    db.commit()
    db.refresh(details)
    
    # Generate PDFs
    try:
        # 1. Polis Repot
        p_path = pdf_service.generate_polis_repot(details)
        
        # 2. Rajah Kasar 
        r_path = pdf_service.generate_rajah_kasar(details, sketch_path=None) 
        
        # 3. Keputusan
        k_path = pdf_service.generate_keputusan(details)
        
        return {
            "message": "Reports generated successfully",
            "files": {
                "polis_repot": os.path.basename(p_path),
                "rajah_kasar": os.path.basename(r_path),
                "keputusan": os.path.basename(k_path)
            }
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to generate reports: {str(e)}")

@router.get("/reports/{session_id}/download/{report_type}")
def download_report(session_id: str, report_type: str, db: Session = Depends(get_session)):
    # report_type: 'polis_repot', 'rajah_kasar', 'keputusan'
    details = db.exec(select(PoliceReportDetails).where(PoliceReportDetails.session_id == session_id)).first()
    if not details:
        raise HTTPException(404, "Report details not found for this session")
    
    try:
        path = ""
        if report_type == "polis_repot":
            path = pdf_service.generate_polis_repot(details)
        elif report_type == "rajah_kasar":
            path = pdf_service.generate_rajah_kasar(details)
        elif report_type == "keputusan":
            path = pdf_service.generate_keputusan(details)
        else:
            raise HTTPException(400, "Invalid report type")
            
        if not os.path.exists(path):
             raise HTTPException(500, "Report file creation failed")
             
        return FileResponse(path, filename=os.path.basename(path), media_type='application/pdf')
    except Exception as e:
        raise HTTPException(500, f"Error retrieving report: {str(e)}")
