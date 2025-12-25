import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from sse_starlette.sse import EventSourceResponse

from srcs.database import get_session
from srcs.models.session import AccidentSession
from srcs.models.report import AccidentReport, PoliceReportDetails, Evidence, EvidenceType
from srcs.models.enums import SessionStatus
from srcs.services.event_service import event_manager
from srcs.services.qr_service import QRService
from srcs.services.pdf_service import PDFService
from srcs.config import HOST, PORT

router = APIRouter(prefix="/session", tags=["Session"])

@router.post("/create")
async def create_session(user_id: str, db: Session = Depends(get_session)):
    session_id = str(uuid.uuid4())
    otp = QRService.generate_otp()
    
    new_session = AccidentSession(
        id=session_id,
        otp=otp,
        driver_a_id=user_id,
        status=SessionStatus.CREATED
    )
    db.add(new_session)
    db.commit()
    
    # Generate QR with OTP embedded logic (or just link to deep link)
    # For this demo, we can just encode the OTP or SessionID+OTP
    qr_data = f"mysettle://join?otp={otp}" 
    # generate_qr_base64 now returns just the base64 string
    qr_image = QRService.generate_qr_base64(qr_data)
    
    return {
        "session_id": session_id,
        "otp": otp,
        "qr_image": qr_image
    }

from srcs.models.user import User

@router.post("/join")
async def join_session(otp: str, user_id: str, db: Session = Depends(get_session)):
    statement = select(AccidentSession).where(AccidentSession.otp == otp)
    session_obj = db.exec(statement).first()
    
    if not session_obj:
        raise HTTPException(status_code=404, detail="Invalid OTP")
        
    if session_obj.driver_b_id:
         if session_obj.driver_b_id != user_id:
             raise HTTPException(status_code=400, detail="Session full")
    
    session_obj.driver_b_id = user_id
    session_obj.status = SessionStatus.HANDSHAKE
    db.add(session_obj)
    db.commit()
    
    # Notify Listener (Driver A) - Include Driver B's details
    driver_b = db.get(User, user_id)
    driver_b_data = driver_b.model_dump() if driver_b else {"id": user_id, "name": "Unknown"}

    await event_manager.publish(session_obj.id, "HANDSHAKE_COMPLETE", {"driver_b": driver_b_data})
    return {"session_id": session_obj.id, "status": "JOINED"}

@router.post("/reconnect")
async def reconnect_session(otp: str, user_id: str, db: Session = Depends(get_session)):
    statement = select(AccidentSession).where(AccidentSession.otp == otp)
    session_obj = db.exec(statement).first()

    if not session_obj:
        raise HTTPException(status_code=404, detail="Invalid OTP")

    # Determine Role
    role = None
    partner_id = None
    if session_obj.driver_a_id == user_id:
        role = "DRIVER_A"
        partner_id = session_obj.driver_b_id
    elif session_obj.driver_b_id == user_id:
        role = "DRIVER_B"
        partner_id = session_obj.driver_a_id
    else:
        raise HTTPException(status_code=403, detail="User not part of this session")

    # Fetch Partner Details
    partner = None
    if partner_id:
        partner_obj = db.get(User, partner_id)
        if partner_obj:
            partner = partner_obj.model_dump()

    # Check Draft Status
    has_submitted = False
    if role == "DRIVER_A" and session_obj.driver_a_draft_id:
        has_submitted = True
    elif role == "DRIVER_B" and session_obj.driver_b_draft_id:
        has_submitted = True

    return {
        "session_id": session_obj.id,
        "status": session_obj.status,
        "role": role,
        "partner": partner,
        "has_submitted_draft": has_submitted
    }

@router.get("/stream/{session_id}")
async def message_stream(request: Request, session_id: str):
    return EventSourceResponse(event_manager.subscribe(session_id))

@router.get("/report/{session_id}/meta")
def get_report_meta(session_id: str, db: Session = Depends(get_session)):
    statement = select(AccidentReport).where(AccidentReport.session_id == session_id)
    report = db.exec(statement).first()
    if not report:
        raise HTTPException(404, "Report not found")
    return report

@router.post("/sign")
async def sign_session(session_id: str, user_id: str, signature: str, db: Session = Depends(get_session)):
    """
    User signs the final report.
    """
    # Find Report
    statement = select(AccidentReport).where(AccidentReport.session_id == session_id)
    report = db.exec(statement).first()
    if not report:
        raise HTTPException(404, "Report not found")
        
    session_obj = db.get(AccidentSession, session_id)
    
    if user_id == session_obj.driver_a_id:
        report.driver_a_signature = signature
    elif user_id == session_obj.driver_b_id:
        report.driver_b_signature = signature
    else:
        raise HTTPException(400, "User is not a participant")
        
    db.add(report)
    db.commit()
    
    # Check Closure
    if report.police_signature and report.driver_a_signature and report.driver_b_signature:
        session_obj.status = SessionStatus.COMPLETED
        db.add(session_obj)
        
        # Generate PDFs
        pdf_service = PDFService()
        if report.report_details_id:
            details = db.get(PoliceReportDetails, report.report_details_id)
            if details:
                # 1. Polis Repot
                # Use signatures
                signed_by_pengadu = None
                signed_by_police = None
                
                if report.driver_a_signature:
                    signed_by_pengadu = details.pengadu_nama
                if report.police_signature:
                    signed_by_police = details.pegawai_penyiasat_nama
                
                f_polis = pdf_service.generate_polis_repot(
                    details, 
                    signed_by_pengadu=signed_by_pengadu,
                    signed_by_police=signed_by_police
                )
                url_polis = f"/reports/{os.path.basename(f_polis)}"
                report.polis_repot_url = url_polis
                
                # 2. Rajah Kasar
                # Resolve sketch again for completeness
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
                        sketch_data = io.BytesIO(base64.b64decode(content))
                    except:
                        pass

                f_rajah = pdf_service.generate_rajah_kasar(details, sketch_data=sketch_data) 
                url_rajah = f"/reports/{os.path.basename(f_rajah)}"
                report.rajah_kasar_url = url_rajah
                
                # 3. Keputusan
                f_keputusan = pdf_service.generate_keputusan(details)
                url_keputusan = f"/reports/{os.path.basename(f_keputusan)}"
                report.keputusan_url = url_keputusan

        db.add(report)
        db.commit()
        
        await event_manager.publish(session_id, "CASE_CLOSED", {
            "polis_repot": report.polis_repot_url,
            "rajah_kasar": report.rajah_kasar_url,
            "keputusan": report.keputusan_url
        })
    else:
        # Notify that someone signed
        await event_manager.publish(session_id, "USER_SIGNED", {"user_id": user_id})
        
    return {"status": "SIGNED"}
