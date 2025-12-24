import uuid
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from sse_starlette.sse import EventSourceResponse

from srcs.database import get_session
from srcs.models.session import AccidentSession
from srcs.models.report import AccidentReport
from srcs.models.enums import SessionStatus
from srcs.services.event_service import event_manager
from srcs.services.qr_service import QRService

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
    qr_image = QRService.generate_qr_base64(qr_data)
    
    return {
        "session_id": session_id,
        "otp": otp,
        "qr_image": qr_image
    }

@router.post("/join")
async def join_session(otp: str, user_id: str, db: Session = Depends(get_session)):
    statement = select(AccidentSession).where(AccidentSession.otp == otp)
    session_obj = db.exec(statement).first()
    
    if not session_obj:
        raise HTTPException(status_code=404, detail="Invalid OTP")
        
    if session_obj.driver_b_id:
         # simple check to avoid overwriting or if re-joining
         if session_obj.driver_b_id != user_id:
             raise HTTPException(status_code=400, detail="Session full")
    
    session_obj.driver_b_id = user_id
    session_obj.status = SessionStatus.HANDSHAKE
    db.add(session_obj)
    db.commit()
    
    # Notify Listener (Driver A)
    await event_manager.publish(session_obj.id, "HANDSHAKE_COMPLETE", {"driver_b": user_id})
    return {"session_id": session_obj.id, "status": "JOINED"}

@router.get("/stream/{session_id}")
async def message_stream(request: Request, session_id: str):
    return EventSourceResponse(event_manager.subscribe(session_id))

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
        db.commit()
        await event_manager.publish(session_id, "CASE_CLOSED", {"final_report": "http://pdf-url..."})
    else:
        # Notify that someone signed
        await event_manager.publish(session_id, "USER_SIGNED", {"user_id": user_id})
        
    return {"status": "SIGNED"}
