import time
import threading
import json
import base64
import sys
import os
import sys

from srcs.config import HOST, PORT
from test_client import TestClient

# Constants
BASE_URL = f"http://localhost:{PORT}"
client = TestClient(BASE_URL)

# State flags
state = {
    "handshake_complete": False,
    "police_signed": False,
    "case_closed": False
}

def sse_listener(session_id: str):
    """
    Background worker that listens to SSE stream and updates state.
    """
    path = f"/session/stream/{session_id}"
    print(f"[SSE] Connecting to stream for session {session_id}...")

    try:
        response = client.connect_sse(path)
        if not response:
            print("[SSE] Failed to connect")
            return

        print("[SSE] Connected.")

        for line in response.iter_lines():
            if line:
                decoded = line.decode('utf-8')
                if decoded.startswith("event:"):
                    event_type = decoded.replace("event:", "").strip()
                elif decoded.startswith("data:"):
                    try:
                        data = json.loads(decoded.replace("data:", "").strip())
                        print(f"\n[SSE Event] {event_type}: {data}")
                        
                        if event_type == "HANDSHAKE_COMPLETE":
                            state["handshake_complete"] = True
                        elif event_type == "POLICE_SIGNED":
                            state["police_signed"] = True
                        elif event_type == "CASE_CLOSED":
                            state["case_closed"] = True
                            
                    except:
                        pass
    except Exception as e:
        print(f"[SSE] Stream error: {e}")

def display_qr(base64_string):
    try:
        # Strip data URI prefix if present
        if "," in base64_string:
            _, base64_string = base64_string.split(",", 1)

        # Fix padding if needed
        missing_padding = len(base64_string) % 4
        if missing_padding:
            base64_string += '=' * (4 - missing_padding)
            
        image_data = base64.b64decode(base64_string)
        
        filename = "temp_qr.png"
        with open(filename, "wb") as f:
            f.write(image_data)
            
        print(f"[UI] Saved QR to {filename}")
        
        if sys.platform == "win32":
            os.startfile(filename)
        else:
            # Fallback for non-windows if ever needed, though user is on windows
            import subprocess
            if sys.platform == "darwin":
                subprocess.call(["open", filename])
            else:
                subprocess.call(["xdg-open", filename])
                
        print("[UI] QR Code opened in default viewer.")
    except Exception as e:
        print(f"[UI] Failed to display QR: {e}")

def main():
    print("=== Mock Driver A Started ===")

    # 1. Login
    print("\n>>> Logging in as driver_a...")
    user_a = client.post("/auth/login", params={"user_id": "driver_a"})
    print(f"Logged in: {user_a.get('name')} ({user_a.get('id')})")

    # 2. Create Session
    print("\n>>> Creating Session...")
    session_data = client.post("/session/create", params={"user_id": "driver_a"})
    session_id = session_data['session_id']
    otp = session_data['otp']
    print(f"Session Created! ID: {session_id}")
    print(f"OTP: {otp}")

    # 3. Start SSE Listener
    t = threading.Thread(target=sse_listener, args=(session_id,), daemon=True)
    t.start()
    
    # 4. Show QR
    qr_b64 = session_data.get('qr_image')
    if qr_b64:
        print("\n>>> Displaying QR Code...")
        display_qr(qr_b64)
    else:
        print("\n[WARN] No QR Code received in payload.")

    # 5. Wait for Handshake
    print("\n>>> Waiting for Driver B to join (Scan QR or use OTP)...")
    while not state["handshake_complete"]:
        time.sleep(1)
    
    print("\n[SUCCESS] Driver B has joined!")
    
    # 6. Submit Draft
    print("\n>>> Submitting Accident Report Draft...")
    # Simulate filling form
    draft_payload = {
        "accident_time": "2024-12-25T14:30:00",
        "weather": "Sunny",
        "road_surface": "Dry",
        "location": "Jalan Tun Razak",
        "description": "I was driving straight when Driver B hit me from the side.",
        "incident_type": "NON_INJURY",
        "at_fault_driver": "Him"
    }
    
    # Simulate some evidence
    evidence_payload = [
        {"type": "TEXT", "tag": "Other", "content": "He was using phone."}
    ]

    p_submit = {
        "session_id": session_id,
        "user_id": "driver_a",
        "draft": draft_payload,
        "evidences": evidence_payload
    }

    res = client.post("/report/submit", json=p_submit)
    print(f"Report Submitted. Status: {res.get('status')}")

    # 7. Wait for Police
    print("\n>>> Waiting for Police to review and sign...")
    # Because there's no automated police in this script (unless backend auto-generates),
    # this might hang if no one plays police. 
    # But user asked to do "the rest that is supposed to be done by driver a".
    # Driver A waits for notification that police has signed.
    
    while not state["police_signed"]:
        time.sleep(1)
        if state["case_closed"]: # Just in case we missed it
            break

    print("\n[SUCCESS] Police has signed the report!")

    # 8. Sign Report
    print("\n>>> Signing the report...")
    p_sign = {
        "session_id": session_id,
        "user_id": "driver_a",
        "signature": "driver_a_signature_base64_string"
    }
    sign_res = client.post("/session/sign", params=p_sign)
    print(f"Signed. Status: {sign_res.get('status')}")

    # 9. Wait for Case Close
    print("\n>>> Waiting for Case Closure...")
    while not state["case_closed"]:
         time.sleep(1)
    
    print("\n[SUCCESS] Case Closed! Flow Complete for Driver A.")
    # Keep window open briefly
    time.sleep(2)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"\nError: {e}")
