from xml.etree.ElementTree import indent
import json
import time
import threading
from srcs.config import HOST, PORT

from test_client import TestClient

BASE_URL = f"http://localhost:{PORT}"
client = TestClient(BASE_URL)

# Thread-safe printing
print_lock = threading.Lock()
_orig_print = print

def print(*args, **kwargs):
    with print_lock:
        _orig_print(*args, **kwargs)


# ANSI color codes for better readability
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    END = '\033[0m'
    BOLD = '\033[1m'


def log_action(thread, method, direction, description, status, payload=None):
    """
    Unified logging format:
    [Thread] [Method] [Direction] Description (Status) [Payload]
    """
    # Color coding
    thread_color = Colors.CYAN if "Driver A" in thread else Colors.MAGENTA if "Driver B" in thread else Colors.YELLOW
    method_color = Colors.BLUE
    direction_color = Colors.GREEN if direction == "SEND" else Colors.YELLOW
    status_color = Colors.GREEN if status in ["OK", "SUCCESS"] else Colors.RED if status in ["KO",
                                                                                            "FAILED"] else Colors.YELLOW

    status_str = f"({status_color}{status}{Colors.END})"
    payload_str = ""

    if payload:
        if isinstance(payload, dict):
            # Show summarized payload for dicts, but do NOT truncate for now
            safe_payload = payload.copy()
            for k, v in safe_payload.items():
                # No Truncation
                pass
                
            payload_str = f" {Colors.BOLD}[{json.dumps(safe_payload)}]{Colors.END}"
        else:
            payload_str = f" {Colors.BOLD}[{payload}]{Colors.END}"

    print(
        f"{thread_color}[{thread}]{Colors.END} {method_color}[{method}]{Colors.END} {direction_color}[{direction}]{Colors.END} {description} {status_str}{payload_str}")


def sse_listener(session_id: str, user_name: str):
    """
    Background worker that listens to SSE stream and prints events.
    """
    path = f"/session/stream/{session_id}"
    log_action(user_name, "SSE", "SEND", "Connecting to stream", "CONNECTING")

    try:
        response = client.connect_sse(path)
        if not response:
            log_action(user_name, "SSE", "RECEIVE", "Failed to connect", "KO")
            return

        log_action(user_name, "SSE", "RECEIVE", "Stream connected", "OK")

        for line in response.iter_lines():
            if line:
                decoded = line.decode('utf-8')

                # Parse SSE events
                if decoded.startswith("event:"):
                    event_type = decoded.replace("event:", "").strip()
                elif decoded.startswith("data:"):
                    try:
                        data = json.loads(decoded.replace("data:", "").strip())
                        log_action(user_name, "SSE", "RECEIVE", f"Event: {event_type}", "OK", data)
                    except:
                        log_action(user_name, "SSE", "RECEIVE", f"Event: {event_type}", "OK",
                                   decoded.replace("data:", "").strip())

    except Exception as e:
        log_action(user_name, "SSE", "RECEIVE", "Stream closed", "DISCONNECTED")


def run_tests():
    print(f"{Colors.BOLD}{'=' * 80}{Colors.END}")
    print(f"{Colors.BOLD}Running E2E Test Flow{Colors.END}")
    print(f"{Colors.BOLD}{'=' * 80}{Colors.END}\n")

    # ========== STEP 1: Authentication ==========
    print(f"\n{Colors.BOLD}>>> STEP 1: Authentication{Colors.END}")

    p_a = {"user_id": "driver_a"}
    log_action("Main", "POST", "SEND", "/auth/login for driver_a", "PENDING", p_a)
    user_a = client.post("/auth/login", params=p_a)
    log_action("Main", "POST", "RECEIVE", "Driver A logged in", "OK",
               {"user_id": user_a.get('id'), "name": user_a.get('name')})

    p_b = {"user_id": "driver_b"}
    log_action("Main", "POST", "SEND", "/auth/login for driver_b", "PENDING", p_b)
    user_b = client.post("/auth/login", params=p_b)
    log_action("Main", "POST", "RECEIVE", "Driver B logged in", "OK",
               {"user_id": user_b.get('id'), "name": user_b.get('name')})

    p_police = {"user_id": "police_main"}
    log_action("Main", "POST", "SEND", "/auth/login for police_main", "PENDING", p_police)
    police = client.post("/auth/login", params=p_police)
    log_action("Main", "POST", "RECEIVE", "Police logged in", "OK",
               {"user_id": police.get('id'), "name": police.get('name')})

    # ========== STEP 2: Session Creation ==========
    print(f"\n{Colors.BOLD}>>> STEP 2: Session Creation{Colors.END}")

    p_create = {"user_id": "driver_a"}
    log_action("Driver A", "POST", "SEND", "/session/create", "PENDING", p_create)
    session_data = client.post("/session/create", params=p_create)
    session_id = session_data['session_id']
    otp = session_data['otp']
    log_action("Driver A", "POST", "RECEIVE", "Session created", "SUCCESS",
               {"session_id": session_id[:8] + "...", "otp": otp})

    # Start Driver A stream
    t1 = threading.Thread(target=sse_listener, args=(session_id, "Driver A"), daemon=True)
    t1.start()
    time.sleep(1)

    # ========== STEP 3: Session Join ==========
    print(f"\n{Colors.BOLD}>>> STEP 3: Session Join{Colors.END}")

    p_join = {"otp": otp, "user_id": "driver_b"}
    log_action("Driver B", "POST", "SEND", f"/session/join with OTP {otp}", "PENDING", p_join)
    join_res = client.post("/session/join", params=p_join)
    log_action("Driver B", "POST", "RECEIVE", "Joined session", "SUCCESS",
               {"session_id": join_res.get('session_id', '')[:8] + "...", "status": join_res.get('status')})

    # Start Driver B stream
    t2 = threading.Thread(target=sse_listener, args=(session_id, "Driver B"), daemon=True)
    t2.start()
    time.sleep(1)

    # ========== STEP 4: Utilities ==========
    print(f"\n{Colors.BOLD}>>> STEP 4: Utility Functions{Colors.END}")

    p_map = {"lat": 1.54978, "lng": 103.78092}
    log_action("Main", "POST", "SEND", "/util/scene-map", "PENDING", p_map)
    map_res = client.post("/util/scene-map", json=p_map)
    log_action("Main", "POST", "RECEIVE", "Scene map generated", "OK", {"image": "..." if map_res.get('image') else None})

    # Save the base64 image to validation
    img_b64 = map_res.get('image')
    if img_b64 and len(img_b64) > 100: # Simple check if it looks like real data
        import base64
        try:
            with open("test_sketch.png", "wb") as f:
                f.write(base64.b64decode(img_b64))
            print(f"{Colors.GREEN}   > Saved map sketch to 'test_sketch.png'{Colors.END}")
        except Exception as e:
            print(f"{Colors.RED}   > Failed to save map sketch: {e}{Colors.END}")

    p_verify = {"image_base64": "fake", "description": "car"}
    log_action("Main", "POST", "SEND", "/util/verify-image", "PENDING", p_verify)
    verify_res = client.post("/util/verify-image", json=p_verify)
    log_action("Main", "POST", "RECEIVE", "Image verified", "OK",
               {"valid": verify_res.get('valid'), "car_plate": verify_res.get('car_plate')})

    # ========== STEP 5: Evidence & Draft Submission ==========
    print(f"\n{Colors.BOLD}>>> STEP 5: Evidence & Draft Submission{Colors.END}")

    evidence_payload = [
        {"type": "PHOTO", "tag": "Car Front", "content": "base64_photo"},
        {"type": "TEXT", "tag": "Other", "content": "It was his fault"}
    ]
    
    draft_payload = {
        "accident_time": "2024-12-25T14:30:00",
        "weather": "Sunny",
        "road_surface": "Dry",
        "location": "Jalan Tun Razak",
        "description": "I was hit from behind.",
        "incident_type": "NON_INJURY"
    }

    p_submit_a = {
        "session_id": session_id, 
        "user_id": "driver_a", 
        "evidences": evidence_payload,
        "draft": draft_payload
    }
    log_action("Driver A", "POST", "SEND", "/report/submit with Draft + Evidence", "PENDING", p_submit_a)
    submit_a = client.post("/report/submit", json=p_submit_a)
    log_action("Driver A", "POST", "RECEIVE", "Report submitted", "SUCCESS", {"status": submit_a.get('status')})
    
    if submit_a.get('status') != "WAITING_FOR_PARTNER":
        log_action("Driver A", "ASSERT", "CHECK", "Status should be WAITING_FOR_PARTNER", "FAILED")
    
    time.sleep(0.5)

    p_submit_b = {
        "session_id": session_id, 
        "user_id": "driver_b", 
        "evidences": evidence_payload,
        "draft": draft_payload
    }
    log_action("Driver B", "POST", "SEND", "/report/submit with Draft + Evidence", "PENDING", p_submit_b)
    submit_b = client.post("/report/submit", json=p_submit_b)
    log_action("Driver B", "POST", "RECEIVE", "Report submitted", "SUCCESS", {"status": submit_b.get('status')})
    
    if submit_b.get('status') != "SUBMITTED":
        log_action("Driver B", "ASSERT", "CHECK", "Status should be SUBMITTED", "FAILED")
        
    time.sleep(1)

    # ========== STEP 6: Police Meeting ==========
    print(f"\n{Colors.BOLD}>>> STEP 6: Police Intervention{Colors.END}")

    # Check Dashboard (Should be PENDING_POLICE)
    log_action("Police", "GET", "SEND", "/police/dashboard", "PENDING")
    dash_res = client.get("/police/dashboard")
    found = any(s['id'] == session_id for s in dash_res)
    log_action("Police", "GET", "RECEIVE", f"Dashboard check (PENDING_POLICE): {found}", "SUCCESS" if found else "FAILED", dash_res)

    p_meeting = {"session_id": session_id, "police_id": "police_main"}
    log_action("Police", "POST", "SEND", "/police/meeting", "PENDING", p_meeting)
    meeting_res = client.post("/police/meeting", params=p_meeting)
    log_action("Police", "POST", "RECEIVE", "Meeting created", "SUCCESS", {"link": meeting_res.get('link')})
    time.sleep(1)

    # Check Dashboard (Should be MEETING_STARTED)
    log_action("Police", "GET", "SEND", "/police/dashboard", "PENDING")
    dash_res = client.get("/police/dashboard")
    found = any(s['id'] == session_id for s in dash_res)
    found_status = next((s['status'] for s in dash_res if s['id'] == session_id), None)
    log_action("Police", "GET", "RECEIVE", f"Dashboard check (MEETING_STARTED): {found}", "SUCCESS" if found else "FAILED", {"status": found_status})

    # ========== STEP 7: Police Verification ==========
    print(f"\n{Colors.BOLD}>>> STEP 7: Police Verification{Colors.END}")

    # 1. Police checks Details
    log_action("Police", "GET", "SEND", f"/police/reports/{session_id}/details", "PENDING")
    details_res = client.get(f"/police/reports/{session_id}/details")
    
    # Log key details
    log_action("Police", "GET", "RECEIVE", "Got Report Context", "SUCCESS", 
               {"report_id": details_res.get('report_id'), "driver_a_evidences": len(details_res.get('driver_a', {}).get('evidences', []))})
    
    report_id = details_res.get('report_id')

    # 2. Driver Checks Report Meta
    log_action("Driver A", "GET", "SEND", f"/session/report/{session_id}/meta", "PENDING")
    meta_res = client.get(f"/session/report/{session_id}/meta")
    log_action("Driver A", "GET", "RECEIVE", "Got Report Meta", "SUCCESS", 
               {"polis_repot_url": meta_res.get('polis_repot_url'), "police_signature": meta_res.get('police_signature')})

    # ========== STEP 7.5: Police Generation ==========
    print(f"\n{Colors.BOLD}>>> STEP 7.5: Police Generation{Colors.END}")
    
    # Police updates decision and generates final report
    p_gen = {
        "report_id": report_id,
        "faulty_driver": "A", # This should auto-fill details for Driver A as faulty
        "updates": {
            "keputusan_awal": "SAMAN POL 257",
            "seksyen_kesalahan": "Sek 41(1) APJ 1987",
            "saman_amount": "300"
        }
    }
    
    log_action("Police", "POST", "SEND", "/police/reports/generate", "PENDING", p_gen)
    gen_res = client.post("/police/reports/generate", json=p_gen)
    log_action("Police", "POST", "RECEIVE", "Report Generated", "SUCCESS", gen_res)


    # ========== STEP 8: Police Signature ==========
    print(f"\n{Colors.BOLD}>>> STEP 8: Police Signature{Colors.END}")

    p_sign_police = {"session_id": session_id, "police_id": "police_main", "signature": "police_sig"}
    log_action("Police", "POST", "SEND", "/police/sign", "PENDING", p_sign_police)
    police_sign = client.post("/police/sign",
                              params=p_sign_police)
    log_action("Police", "POST", "RECEIVE", "Police signed report", "SUCCESS", {"status": police_sign.get('status')})
    time.sleep(1)

    # Check Dashboard (Should be POLICE_SIGNED)
    log_action("Police", "GET", "SEND", "/police/dashboard", "PENDING")
    dash_res = client.get("/police/dashboard")
    found = any(s['id'] == session_id for s in dash_res)
    found_status = next((s['status'] for s in dash_res if s['id'] == session_id), None)
    log_action("Police", "GET", "RECEIVE", f"Dashboard check (POLICE_SIGNED): {found}", "SUCCESS" if found else "FAILED", {"status": found_status})

    # ========== STEP 9: User Signatures ==========
    print(f"\n{Colors.BOLD}>>> STEP 9: User Signatures (Case Closure){Colors.END}")

    p_sign_a = {"session_id": session_id, "user_id": "driver_a", "signature": "a_sig"}
    log_action("Driver A", "POST", "SEND", "/session/sign", "PENDING", p_sign_a)
    sign_a = client.post("/session/sign",
                         params=p_sign_a)
    log_action("Driver A", "POST", "RECEIVE", "Driver A signed", "SUCCESS", {"status": sign_a.get('status')})

    p_sign_b = {"session_id": session_id, "user_id": "driver_b", "signature": "b_sig"}
    log_action("Driver B", "POST", "SEND", "/session/sign", "PENDING", p_sign_b)
    sign_b = client.post("/session/sign",
                         params=p_sign_b)
    log_action("Driver B", "POST", "RECEIVE", "Driver B signed", "SUCCESS", {"status": sign_b.get('status')})
    time.sleep(2)

    # Wait for CASE_CLOSED
    time.sleep(3)
    
    # Check Dashboard (Should be COMPLETED)
    log_action("Police", "GET", "SEND", "/police/dashboard", "PENDING")
    dash_res = client.get("/police/dashboard")
    found = any(s['id'] == session_id for s in dash_res)
    found_status = next((s['status'] for s in dash_res if s['id'] == session_id), None)
    log_action("Police", "GET", "RECEIVE", f"Dashboard check (COMPLETED): {found}", "SUCCESS" if found else "FAILED", {"status": found_status})
    
    print(f"\n{Colors.BOLD}{'=' * 80}{Colors.END}")
    print(f"{Colors.GREEN}{Colors.BOLD}✓ Test flow completed successfully{Colors.END}")
    print(f"{Colors.BOLD}{'=' * 80}{Colors.END}\n")


if __name__ == "__main__":
    try:
        run_tests()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Test interrupted by user{Colors.END}")
    except Exception as e:
        print(f"\n{Colors.RED}ERROR: {e}{Colors.END}")
        import traceback

        traceback.print_exc()