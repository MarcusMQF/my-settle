from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import Session, select
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import os

from srcs.database import get_session
from srcs.models.session import AccidentSession
from srcs.models.report import AccidentReport, AccidentReportDraft, PoliceReportDetails, Evidence, EvidenceType
from srcs.models.user import User
from srcs.models.enums import SessionStatus
from srcs.services.event_service import event_manager
from srcs.services.pdf_service import PDFService
from fastapi.responses import FileResponse

router = APIRouter(prefix="/police", tags=["Police"])

# --- Response Models ---

class DriverInfo(BaseModel):
    user: User
    draft: AccidentReportDraft | None = None
    evidences: List[Evidence] = []

class PoliceContextResponse(BaseModel):
    session_id: str
    report_id: int | None
    report_details: PoliceReportDetails | None
    driver_a: DriverInfo
    driver_b: DriverInfo

class GenerateReportRequest(BaseModel):
    report_id: int
    faulty_driver: str | None = None # "A" or "B"
    updates: Dict[str, Any] | None = None # Partial updates for decision fields using dict to avoid full model validation issues

# -----------------------

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_session)):
    # Return all sessions that are ready for police or already processed
    stm = select(AccidentSession).where(
        AccidentSession.status.in_([
            SessionStatus.PENDING_POLICE,
            SessionStatus.MEETING_STARTED,
            SessionStatus.POLICE_SIGNED,
            SessionStatus.COMPLETED
        ])
    )
    results = db.exec(stm).all()
    return results

@router.get("/reports/{session_id}/details", response_model=PoliceContextResponse)
def get_report_details(session_id: str, db: Session = Depends(get_session)):
    # 1. Fetch Session
    session_obj = db.get(AccidentSession, session_id)
    if not session_obj:
        raise HTTPException(404, "Session not found")

    # 2. Fetch Report (if exists)
    stmt_report = select(AccidentReport).where(AccidentReport.session_id == session_id)
    report = db.exec(stmt_report).first()
    
    report_details = None
    if report and report.report_details_id:
        report_details = db.get(PoliceReportDetails, report.report_details_id)

    # 3. Fetch Drivers
    user_a = db.get(User, session_obj.driver_a_id)
    user_b = db.get(User, session_obj.driver_b_id) if session_obj.driver_b_id else None
    
    # 4. Fetch Drafts
    draft_a = db.get(AccidentReportDraft, session_obj.driver_a_draft_id) if session_obj.driver_a_draft_id else None
    draft_b = db.get(AccidentReportDraft, session_obj.driver_b_draft_id) if session_obj.driver_b_draft_id else None

    # 5. Fetch Evidences & Organize
    # We fetch all evidence for the drafts involved
    evidences_a = []
    evidences_b = []
    
    if draft_a:
        stmt_ev_a = select(Evidence).where(Evidence.draft_id == draft_a.id)
        evidences_a = db.exec(stmt_ev_a).all()
        
    if draft_b:
        stmt_ev_b = select(Evidence).where(Evidence.draft_id == draft_b.id)
        evidences_b = db.exec(stmt_ev_b).all()

    # Construct Response
    return PoliceContextResponse(
        session_id=session_id,
        report_id=report.id if report else None,
        report_details=report_details,
        driver_a=DriverInfo(user=user_a, draft=draft_a, evidences=evidences_a),
        driver_b=DriverInfo(user=user_b, draft=draft_b, evidences=evidences_b) if user_b else DriverInfo(user=User(id="unknown", name="Unknown", ic_no="", phone_number="")) # Fallback if B missing
    )

@router.post("/meeting")
async def start_meeting(session_id: str, police_id: str, db: Session = Depends(get_session)):
    session_obj = db.get(AccidentSession, session_id)
    if not session_obj:
        raise HTTPException(404, "Session not found")
        
    # Generate Google Meet Link (Mocked)
    link = f"https://meet.google.com/mock-{session_id[:8]}"
    session_obj.meet_link = link
    session_obj.police_id = police_id
    session_obj.status = SessionStatus.MEETING_STARTED
    
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
    session_obj.status = SessionStatus.POLICE_SIGNED
    db.add(session_obj)
    
    db.commit()
    
    await event_manager.publish(session_id, "POLICE_SIGNED", {"status": "SIGNED", "police_id": police_id})
    return {"status": "SIGNED"}

pdf_service = PDFService()

@router.post("/reports/generate")
def generate_reports(req: GenerateReportRequest, db: Session = Depends(get_session)):
    import uuid
    # 1. Fetch Report
    report = db.get(AccidentReport, req.report_id)
    if not report:
        raise HTTPException(404, "Report not found")
        
    if not report.report_details_id:
        raise HTTPException(400, "Report details not initialized")
        
    details = db.get(PoliceReportDetails, report.report_details_id)
    if not details:
        raise HTTPException(404, "Report details object missing")
    
    # Auto-fill faulty driver logic if requested
    if req.faulty_driver:
        session_obj = db.get(AccidentSession, report.session_id)
        if session_obj:
            faulty_user = None
            faulty_car_no = None
            faulty_car_model = None
            
            if req.faulty_driver == "A":
                faulty_user = db.get(User, session_obj.driver_a_id)
                faulty_car_no = details.kenderaan_a_no
                faulty_car_model = details.kenderaan_a_jenis
            elif req.faulty_driver == "B" and session_obj.driver_b_id:
                faulty_user = db.get(User, session_obj.driver_b_id)
                faulty_car_no = details.kenderaan_b_no
                faulty_car_model = details.kenderaan_b_jenis
            
            if faulty_user:
                details.pihak_salah_nama = faulty_user.name
                details.pihak_salah_ic = faulty_user.ic_no
                details.pihak_salah_alamat = faulty_user.address
                details.pihak_salah_no_kenderaan = faulty_car_no
                details.pihak_salah_jenis_kenderaan = faulty_car_model

    # 2. Apply Updates (Decisions, etc.)
    if req.updates:
        for key, value in req.updates.items():
            if hasattr(details, key):
                setattr(details, key, value)
    
    # Autofill Saman No if not provided
    if not details.saman_no:
        details.saman_no = f"SAMAN-{str(uuid.uuid4())[:8].upper()}"

    db.add(details)
    db.commit()
    db.refresh(details)
    
    # 3. Resolve Sketch (In-Memory)
    import io
    import base64
    sketch_data = None
    
    stmt_sketch = select(Evidence).where(
        Evidence.type == EvidenceType.MAP_SKETCH,
        Evidence.draft_id.in_([report.driver_a_draft_id, report.driver_b_draft_id])
    ).limit(1)
    
    sketch_ev = db.exec(stmt_sketch).first()
    
    if sketch_ev and sketch_ev.content:
        try:
            content = sketch_ev.content
            if "," in content:
                _, content = content.split(",", 1)
            img_bytes = base64.b64decode(content)
            sketch_data = io.BytesIO(img_bytes)
        except Exception as e:
            print(f"Failed to decode sketch: {e}")
            sketch_data = None
    
    # 4. Determine Signatures
    # We pass the Name of the signer if signature exists
    signed_by_pengadu = None
    signed_by_police = None
    
    if report.driver_a_signature:
         signed_by_pengadu = details.pengadu_nama # Driver A is pengadu
    if report.police_signature:
         signed_by_police = details.pegawai_penyiasat_nama

    # 5. Generate PDFs
    try:
        # 1. Polis Repot
        p_path = pdf_service.generate_polis_repot(
            details, 
            signed_by_pengadu=signed_by_pengadu, 
            signed_by_police=signed_by_police
        )
        
        # 2. Rajah Kasar 
        r_path = pdf_service.generate_rajah_kasar(details, sketch_data=sketch_data)
        
        # 3. Keputusan
        k_path = pdf_service.generate_keputusan(details)

        return {
            "message": "Reports generated successfully",
            "files": {
                "polis_repot": f"/reports/{os.path.basename(p_path)}",
                "rajah_kasar": f"/reports/{os.path.basename(r_path)}",
                "keputusan": f"/reports/{os.path.basename(k_path)}"
            }
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to generate reports: {str(e)}")

@router.get("/reports/{session_id}/download/{report_type}")
def download_report(session_id: str, report_type: str, db: Session = Depends(get_session)):
    # report_type: 'polis_repot', 'rajah_kasar', 'keputusan'
    
    # Needs session to find report to find drivers
    session_obj = db.get(AccidentSession, session_id)
    if not session_obj:
        raise HTTPException(404, "Session not found")
        
    stm_rep = select(AccidentReport).where(AccidentReport.session_id == session_id)
    report = db.exec(stm_rep).first()
    
    if not report or not report.report_details_id:
        raise HTTPException(404, "Report details not found")
        
    details = db.get(PoliceReportDetails, report.report_details_id)
    
    try:
        path = ""
        
        if report_type == "polis_repot":
            # Check signatures again
            signed_by_pengadu = None
            signed_by_police = None
            
            # Driver A is Pengadu
            if report.driver_a_signature:
                signed_by_pengadu = details.pengadu_nama
            if report.police_signature:
                signed_by_police = details.pegawai_penyiasat_nama
            
            path = pdf_service.generate_polis_repot(
                details,
                signed_by_pengadu=signed_by_pengadu,
                signed_by_police=signed_by_police
            )
            
        elif report_type == "rajah_kasar":
            # Re-fetch sketch
            import io
            import base64
            sketch_data = None
            
            stmt_sketch = select(Evidence).where(
                Evidence.type == EvidenceType.MAP_SKETCH,
                Evidence.draft_id.in_([report.driver_a_draft_id, report.driver_b_draft_id])
            ).limit(1)
            
            sketch_ev = db.exec(stmt_sketch).first()
            
            if sketch_ev and sketch_ev.content:
                try:
                    content = sketch_ev.content
                    if "," in content:
                        _, content = content.split(",", 1)
                    img_bytes = base64.b64decode(content)
                    sketch_data = io.BytesIO(img_bytes)
                except:
                    pass
            
            path = pdf_service.generate_rajah_kasar(details, sketch_data=sketch_data)
            
        elif report_type == "keputusan":
            path = pdf_service.generate_keputusan(details)
        else:
            raise HTTPException(400, "Invalid report type")
            
        if not os.path.exists(path):
             raise HTTPException(500, "Report file creation failed")
             
        return FileResponse(path, filename=os.path.basename(path), media_type='application/pdf')
    except Exception as e:
        raise HTTPException(500, f"Error retrieving report: {str(e)}")
