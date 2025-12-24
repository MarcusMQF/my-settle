from xml.etree.ElementTree import indent
import json
import time
import threading
from srcs.config import HOST, PORT

from test_client import TestClient

BASE_URL = f"http://localhost:{PORT}"
client = TestClient(BASE_URL)


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
            # Show summarized payload for dicts
            safe_payload = payload.copy()
            for k, v in safe_payload.items():
                # Truncate long strings
                if isinstance(v, str) and len(v) > 50:
                    safe_payload[k] = v[:47] + "..."
                # Summary for list/dict
                elif isinstance(v, list):
                    safe_payload[k] = f"[{len(v)} items]"
                elif isinstance(v, dict):
                     safe_payload[k] = "{...}"
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

    p_map = {"lat": 3.14, "lng": 101.68}
    log_action("Main", "POST", "SEND", "/util/scene-map", "PENDING", p_map)
    map_res = client.post("/util/scene-map", json=p_map)
    log_action("Main", "POST", "RECEIVE", "Scene map generated", "OK", {"url": "..." if map_res.get('url') else None})

    p_verify = {"image_base64": "fake", "description": "car"}
    log_action("Main", "POST", "SEND", "/util/verify-image", "PENDING", p_verify)
    verify_res = client.post("/util/verify-image", json=p_verify)
    log_action("Main", "POST", "RECEIVE", "Image verified", "OK",
               {"valid": verify_res.get('valid'), "car_plate": verify_res.get('car_plate')})

    # ========== STEP 5: Evidence Submission ==========
    print(f"\n{Colors.BOLD}>>> STEP 5: Evidence Submission{Colors.END}")

    evidence_payload = [
        {"type": "PHOTO", "tag": "Car Front", "content": "base64_photo"},
        {"type": "TEXT", "tag": "Other", "content": "It was his fault"}
    ]

    p_submit_a = {"session_id": session_id, "user_id": "driver_a", "evidences": evidence_payload}
    log_action("Driver A", "POST", "SEND", "/report/submit with 2 evidences", "PENDING", p_submit_a)
    submit_a = client.post("/report/submit",
                           json=p_submit_a)
    log_action("Driver A", "POST", "RECEIVE", "Report submitted", "SUCCESS", {"status": submit_a.get('status')})
    time.sleep(0.5)

    p_submit_b = {"session_id": session_id, "user_id": "driver_b", "evidences": evidence_payload}
    log_action("Driver B", "POST", "SEND", "/report/submit with 2 evidences", "PENDING", p_submit_b)
    submit_b = client.post("/report/submit",
                           json=p_submit_b)
    log_action("Driver B", "POST", "RECEIVE", "Report submitted", "SUCCESS", {"status": submit_b.get('status')})
    time.sleep(1)

    # ========== STEP 6: Police Meeting ==========
    print(f"\n{Colors.BOLD}>>> STEP 6: Police Intervention{Colors.END}")

    p_meeting = {"session_id": session_id, "police_id": "police_main"}
    log_action("Police", "POST", "SEND", "/police/meeting", "PENDING", p_meeting)
    meeting_res = client.post("/police/meeting", params=p_meeting)
    log_action("Police", "POST", "RECEIVE", "Meeting created", "SUCCESS", {"link": meeting_res.get('link')})
    time.sleep(1)

    # ========== STEP 7: Police Signature ==========
    print(f"\n{Colors.BOLD}>>> STEP 7: Police Signature{Colors.END}")

    p_sign_police = {"session_id": session_id, "police_id": "police_main", "signature": "police_sig"}
    log_action("Police", "POST", "SEND", "/police/sign", "PENDING", p_sign_police)
    police_sign = client.post("/police/sign",
                              params=p_sign_police)
    log_action("Police", "POST", "RECEIVE", "Police signed report", "SUCCESS", {"status": police_sign.get('status')})
    time.sleep(1)

    # ========== STEP 8: User Signatures ==========
    print(f"\n{Colors.BOLD}>>> STEP 8: User Signatures (Case Closure){Colors.END}")

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