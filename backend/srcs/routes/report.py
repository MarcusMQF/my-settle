from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel

from srcs.database import get_session
from srcs.models.session import AccidentSession
from srcs.models.report import AccidentReport, Evidence, EvidenceType, AccidentReportDraft, PoliceReportDetails
from srcs.models.enums import SessionStatus, EvidenceTag
from srcs.models.user import User
from srcs.services.event_service import event_manager
from srcs.services.report_aggregator import generate_police_details

router = APIRouter(prefix="/report", tags=["Report"])

class EvidenceItem(BaseModel):
    type: EvidenceType
    tag: EvidenceTag
    title: str | None = None
    content: str # Base64/URL

class DraftData(BaseModel):
    weather: str | None = None
    accident_time: str | None = None # ISO format string
    road_surface: str | None = None
    road_type: str | None = None
    location: str | None = None
    description: str | None = None
    at_fault_driver: str | None = None
    reason: str | None = None
    incident_type: str | None = None
    light_condition: str | None = None

class SubmitRequest(BaseModel):
    session_id: str
    user_id: str
    evidences: List[EvidenceItem]
    draft: DraftData

@router.post("/submit")
async def submit_report(req: SubmitRequest, db: Session = Depends(get_session)):
    # 1. Save Draft
    from datetime import datetime
    
    # Parse time
    acc_time = None
    if req.draft.accident_time:
        try:
            acc_time = datetime.fromisoformat(req.draft.accident_time.replace("Z", "+00:00"))
        except:
            acc_time = datetime.now()

    new_draft = AccidentReportDraft(
        session_id=req.session_id,
        weather=req.draft.weather,
        accident_time=acc_time,
        road_surface=req.draft.road_surface,
        road_type=req.draft.road_type,
        location=req.draft.location,
        description=req.draft.description,
        at_fault_driver=req.draft.at_fault_driver,
        reason=req.draft.reason,
        incident_type=req.draft.incident_type,
        light_condition=req.draft.light_condition
    )
    db.add(new_draft)
    db.commit()
    db.refresh(new_draft)

    # 2. Update Session (Link Draft)
    session_obj = db.get(AccidentSession, req.session_id)
    if not session_obj:
        raise HTTPException(404, "Session not found")

    is_driver_a = (session_obj.driver_a_id == req.user_id)
    if is_driver_a:
        session_obj.driver_a_draft_id = new_draft.id
    elif session_obj.driver_b_id == req.user_id:
        session_obj.driver_b_draft_id = new_draft.id
    
    db.add(session_obj)
    db.commit()

    # 3. Add Evidence (Link to Report? No, link to Draft or Session. The current model links to Report ID)
    # Issue: We don't have an AccidentReport yet if this is the first submitter.
    # Checks Evidence model: 'report_id' is optional, 'draft_id' is optional.
    # Let's link to draft_id (newly created)
    
    for item in req.evidences:
        final_title = item.title if item.title else item.tag.value
        ev = Evidence(
            draft_id=new_draft.id, # Linked to this specific draft
            uploader_id=req.user_id,
            type=item.type,
            tag=item.tag,
            title=final_title,
            content=item.content
        )
        db.add(ev)
    db.commit()

    # 4. Check if we should generate the Final Report
    db.refresh(session_obj)
    
    if session_obj.driver_a_draft_id and session_obj.driver_b_draft_id:
        # Both Submitted!
        
        # Fetch Users
        user_a = db.get(User, session_obj.driver_a_id)
        user_b = db.get(User, session_obj.driver_b_id)
        
        # Fetch Drafts
        draft_a = db.get(AccidentReportDraft, session_obj.driver_a_draft_id)
        draft_b = db.get(AccidentReportDraft, session_obj.driver_b_draft_id)
        
        # Generate Details
        details = generate_police_details(req.session_id, draft_a, draft_b, user_a, user_b)
        db.add(details)
        db.commit()
        db.refresh(details)
        
        # Create AccidentReport
        # Generate Download Links (Points to Police endpoint)
        base_url = f"/police/reports/{req.session_id}/download"
        
        report = AccidentReport(
            session_id=req.session_id,
            driver_a_draft_id=draft_a.id,
            driver_b_draft_id=draft_b.id,
            report_details_id=details.id,
            polis_repot_url=f"{base_url}/polis_repot",
            rajah_kasar_url=f"{base_url}/rajah_kasar",
            keputusan_url=f"{base_url}/keputusan"
        )
        db.add(report)
        
        # Update Session
        session_obj.status = SessionStatus.PENDING_POLICE
        session_obj.final_report_id = report.id # Wait, verifying field name -> session.py says final_report_id
        # Let's check session.py line 21: final_report_id: int | None
        # Yes.
        
        db.add(session_obj)
        db.commit()
        db.refresh(report)
        
        # Update Report ID in Evidences?
        # Ideally evidence should point to the final report too? 
        # Current Evidence model has 'report_id'.
        # We can update all evidences related to these drafts to point to this report_id.
        stmt_update_ev = select(Evidence).where(Evidence.draft_id.in_([draft_a.id, draft_b.id]))
        evidences = db.exec(stmt_update_ev).all()
        for e in evidences:
            e.report_id = report.id
            db.add(e)
        db.commit()

        await event_manager.publish(req.session_id, "ALL_REPORTS_SUBMITTED", {"report_id": report.id})
        return {"status": "SUBMITTED"}
    else:
        await event_manager.publish(req.session_id, "REPORT_SUBMITTED", {"user_id": req.user_id})
        return {"status": "WAITING_FOR_PARTNER"}
