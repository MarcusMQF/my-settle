from test_client import TestClient
from srcs.config import PORT
import time

BASE_URL = f"http://localhost:{PORT}"
client = TestClient(BASE_URL)

def test_reconnect():
    print(">>> Testing Reconnect Flow")
    
    # 1. Login User A
    user_a = client.post("/auth/login", params={"user_id": "driver_a_recon"})
    print(f"User A Logged In: {user_a['id']}")
    
    # 2. Create Session
    session_data = client.post("/session/create", params={"user_id": user_a['id']})
    otp = session_data['otp']
    print(f"Session Created. OTP: {otp}")
    
    # 3. User A Reconnects
    print("--- User A Reconnects ---")
    recon_a = client.post("/session/reconnect", params={"otp": otp, "user_id": user_a['id']})
    print(f"Reconnect A Result: {recon_a}")
    assert recon_a['status'] == "CREATED"
    assert recon_a['role'] == "DRIVER_A"
    
    # 4. User B Join
    user_b = client.post("/auth/login", params={"user_id": "driver_b_recon"})
    print(f"User B Logged In: {user_b['id']}")
    
    client.post("/session/join", params={"otp": otp, "user_id": user_b['id']})
    print("User B Joined")
    
    # 5. User B Reconnects
    print("--- User B Reconnects ---")
    recon_b = client.post("/session/reconnect", params={"otp": otp, "user_id": user_b['id']})
    print(f"Reconnect B Result: {recon_b}")
    assert recon_b['status'] == "HANDSHAKE" # Joined -> Handshake status in backend? session.py:54 sets HANDSHAKE
    assert recon_b['role'] == "DRIVER_B"
    assert recon_b['partner_id'] == user_a['id']

    print(">>> Reconnect Test Passed")

if __name__ == "__main__":
    test_reconnect()
