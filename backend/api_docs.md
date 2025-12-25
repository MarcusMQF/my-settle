# mySettle API Documentation

This document outlines the API endpoints associated with the "mySettle" car accident resolution flow, categorizing them by the chronological usage in the user journey.

**Base URL**: `http://<HOST>:<PORT>` (e.g., `http://localhost:8000`)

---

## Stage 0: Authentication

### 1. Login
**Endpoint**: `POST /auth/login`
**Description**: Authenticates a user. In this demo, it checks if a user exists or creates a mock profile if they don't.
**Query Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | Yes | Unique identifier for the user (e.g., IC Number or Phone) |

**Response Body**:
Returns a `User` object.
```json
{
  "id": "string",
  "name": "string",
  "ic_no": "string",
  "car_plate": "string",
  "car_model": "string",
  "insurance_policy": "string",
  "is_police": "boolean",
  "address": "string",
  "phone_number": "string",
  "job": "string",
  "license_number": "string"
}
```

---

## Stage 1: Session Initialization & Handshake

### 2. Create Session (Driver A)
**Endpoint**: `POST /session/create`
**Description**: Initiates a new accident session. Returns an OTP and QR code for Driver B to join.
**Query Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `string` | Yes | ID of the driver creating the session |

**Response Body**:
```json
{
  "session_id": "string (UUID)",
  "otp": "string (6 chars)",
  "qr_image": "string (Base64 encoded PNG)"
}
```

### 3. Join Session (Driver B)
**Endpoint**: `POST /session/join`
**Description**: Driver B joins the session using the OTP provided by Driver A.
**Query Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `otp` | `string` | Yes | 6-character OTP from Driver A |
| `user_id` | `string` | Yes | ID of the driver joining |

**Response Body**:
```json
{
  "session_id": "string (UUID)",
  "status": "JOINED"
}
```

### 4. Reconnect
**Endpoint**: `POST /session/reconnect`
**Description**: Allows a user to rejoin an active session and retrieve their current role and context.
**Query Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `otp` | `string` | Yes | 6-character OTP of the session |
| `user_id` | `string` | Yes | ID of the user reconnecting |

**Response Body**:
```json
{
  "session_id": "string (UUID)",
  "status": "string (CREATED | HANDSHAKE | PENDING_POLICE | ...)",
  "role": "DRIVER_A" | "DRIVER_B",
  "partner_id": "string (User ID of the other driver)",
  "has_submitted_draft": "boolean"
}
```

### 5. Event Stream
**Endpoint**: `GET /session/stream/{session_id}`
**Description**: Server-Sent Events (SSE) stream for real-time updates.
**Path Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `string` | Yes | UUID of the session |

**Events**:

| Event Name | Payload Structure | Trigger |
| :--- | :--- | :--- |
| `HANDSHAKE_COMPLETE` | `{"driver_b": "string"}` | Driver B successfully joins. |
| `REPORT_SUBMITTED` | `{"user_id": "string"}` | A driver submits their draft. |
| `ALL_REPORTS_SUBMITTED` | `{"report_id": 123}` | Both drivers have submitted drafts. |
| `MEETING_STARTED` | `{"link": "string"}` | Police initiates a meeting. |
| `POLICE_SIGNED` | `{"status": "SIGNED", "police_id": "..."}` | Police signs the report. |
| `USER_SIGNED` | `{"user_id": "string"}` | A driver signs the final report. |
| `CASE_CLOSED` | `{"polis_repot": "url", "rajah_kasar": "url", "keputusan": "url"}` | All parties have signed. |

---

## Stage 2: Data Collection & Submission

### 6. Submit Accident Report Draft
**Endpoint**: `POST /report/submit`
**Description**: Submits the driver's draft report and evidence.
**Request Body**:
```json
{
  "session_id": "string (UUID)",
  "user_id": "string",
  "draft": {
    "weather": "string",
    "accident_time": "string (ISO 8601, e.g. 2023-10-27T10:00:00)",
    "road_surface": "string",
    "road_type": "string",
    "location": "string",
    "description": "string (Statement/Keterangan)",
    "at_fault_driver": "string (e.g. 'Me', 'Him')",
    "reason": "string",
    "incident_type": "string (e.g. 'Rosak', 'Cedera')",
    "light_condition": "string"
  },
  "evidences": [
    {
      "type": "PHOTO" | "VIDEO" | "MAP_SKETCH" | "TEXT",
      "tag": "Car Front" | "Car Back" | "Car Left" | "Car Right" | "Damage Part" | "Rough Sketch" | "Dashcam" | "Document" | "Other",
      "title": "string (Optional)",
      "content": "string (Base64 encoded data or Raw Text)"
    }
  ]
}
```

**Response Body**:
*Scenario A: Partner hasn't submitted yet*
```json
{
  "status": "WAITING_FOR_PARTNER"
}
```
*Scenario B: Partner has already submitted (Triggers report generation)*
```json
{
  "status": "SUBMITTED"
}
```

---

## Stage 3: Police Review

### 7. Police Dashboard
**Endpoint**: `GET /police/dashboard`
**Description**: Lists all sessions that require police attention.
**Response Body**:
Returns an array of `AccidentSession` objects.
```json
[
  {
    "id": "string (UUID)",
    "otp": "string",
    "driver_a_id": "string",
    "driver_b_id": "string",
    "police_id": "string | null",
    "driver_a_draft_id": "integer | null",
    "driver_b_draft_id": "integer | null",
    "final_report_id": "integer | null",
    "meet_link": "string | null",
    "status": "string (PENDING_POLICE | MEETING_STARTED | ...)",
    "created_at": "string (ISO Date)"
  }
]
```

### 8. Get Session Details (Deep Dive)
**Endpoint**: `GET /police/reports/{session_id}/details`
**Description**: Returns comprehensive details for the police interface, aggregating data from both drivers.
**Path Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `string` | Yes | UUID of the session |

**Response Body** (`PoliceContextResponse`):
```json
{
  "session_id": "string",
  "report_id": "integer | null",
  "report_details": {
    "id": "integer",
    "session_id": "string",
    "report_no": "string",
    "balai_polis": "string",
    "daerah": "string",
    "kontinjen": "string",
    "tahun": "string",
    "tarikh_repot": "string (ISO Date)",
    "bahasa_diterima": "string",
    "penerima_nama": "string",
    "penerima_id": "string",
    "pengadu_nama": "string",
    "pengadu_ic": "string",
    "pengadu_alamat": "string",
    "pengadu_tel": "string",
    "pengadu_pekerjaan": "string",
    "tarikh_kejadian": "string (ISO Date)",
    "tempat_kejadian": "string",
    "jenis_kejadian": "string",
    "keterangan_kes": "string",
    "kenderaan_a_no": "string",
    "kenderaan_a_jenis": "string",
    "pemandu_a_nama": "string",
    "pemandu_a_ic": "string",
    "pemandu_a_lesen": "string",
    "kenderaan_b_no": "string",
    "kenderaan_b_jenis": "string",
    "pemandu_b_nama": "string",
    "pemandu_b_ic": "string",
    "pemandu_b_lesen": "string",
    "seksyen_kesalahan": "string",
    "keputusan_awal": "string",
    "catatan_keputusan": "string",
    "pegawai_penyiasat_nama": "string",
    "pegawai_penyiasat_pangkat": "string",
    "saman_no": "string | null",
    "saman_amount": "string | null"
    // ... possibly more fields from PoliceReportDetails
  },
  "driver_a": {
    "user": {
      "id": "string",
      "name": "string",
      "ic_no": "string",
      "car_plate": "string",
      "car_model": "string",
      "phone_number": "string",
      "insurance_policy": "string"
    },
    "draft": {
       "id": "integer",
       "session_id": "string",
       "weather": "string",
       "accident_time": "string",
       "road_surface": "string",
       "road_type": "string",
       "location": "string",
       "description": "string",
       "at_fault_driver": "string",
       "reason": "string",
       "incident_type": "string",
       "light_condition": "string"
    },
    "evidences": [
      {
        "id": "integer",
        "uploader_id": "string",
        "title": "string",
        "type": "PHOTO" | "VIDEO" | "MAP_SKETCH",
        "content": "string",
        "tag": "string",
        "timestamp": "string"
      }
    ]
  },
  "driver_b": { 
     // Same structure as driver_a
  }
}
```

### 9. Get Report Meta
**Endpoint**: `GET /session/report/{session_id}/meta`
**Description**: Retrieves the metadata of the `AccidentReport` associated with a session. Useful for checking the existence of generated PDF URLs or signature status.
**Path Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `string` | Yes | UUID of the session |

**Response Body**:
```json
{
  "id": "integer",
  "session_id": "string",
  "driver_a_draft_id": "integer",
  "driver_b_draft_id": "integer",
  "report_details_id": "integer",
  "police_signature": "string | null",
  "driver_a_signature": "string | null",
  "driver_b_signature": "string | null",
  "polis_repot_url": "string | null",
  "rajah_kasar_url": "string | null",
  "keputusan_url": "string | null",
  "created_at": "string (ISO Date)"
}
```

---

## Stage 4: Virtual Meeting (Optional)

### 10. Start Meeting
**Endpoint**: `POST /police/meeting`
**Description**: Generates a meeting link and notifies connected drivers.
**Query Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `string` | Yes | UUID of the session |
| `police_id` | `string` | Yes | ID of the police officer |

**Response Body**:
```json
{
  "link": "https://meet.google.com/..."
}
```

---

## Stage 5: Report Generation & Police Signature

### 11. Generate & Update Report
**Endpoint**: `POST /police/reports/generate`
**Description**: Updates specific fields in the police report details (e.g., fault decision) and triggers the regeneration of PDF artifacts.
**Request Body**:
```json
{
  "report_id": 123,
  "faulty_driver": "A" | "B", // (Optional) If "A" or "B", auto-fills 'pihak_salah' fields from that driver's data.
  "updates": {
    "keputusan_awal": "Saman Pol 257 (Kpd A)",
    "saman_amount": "RM300",
    "seksyen_kesalahan": "Sek 10 LN 166/59",
    "catatan_keputusan": "Siasatan diteruskan..."
    // Any other key-value pair matching PoliceReportDetails model
  }
}
```

**Response Body**:
```json
{
  "message": "Reports generated successfully",
  "files": {
    "polis_repot": "/reports/polis_repot_123.pdf",
    "rajah_kasar": "/reports/rajah_kasar_123.pdf",
    "keputusan": "/reports/keputusan_123.pdf"
  }
}
```

### 12. Police Sign Report
**Endpoint**: `POST /police/sign`
**Description**: Submits the police officer's signature to finalize their portion.
**Query Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `string` | Yes | UUID of the session |
| `police_id` | `string` | Yes | ID of the police officer |
| `signature` | `string` | Yes | Base64 string of the signature image (or text representation) |

**Response Body**:
```json
{
  "status": "SIGNED"
}
```

---

## Stage 6: Driver Signatures & Case Closure

### 13. Driver Sign Report
**Endpoint**: `POST /session/sign`
**Description**: A driver signs the finalized report. Case closes when all parties (Driver A, Driver B, Police) have signed.
**Query Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `string` | Yes | UUID of the session |
| `user_id` | `string` | Yes | ID of the signing driver |
| `signature` | `string` | Yes | Base64 string of the signature image (or text representation) |

**Response Body**:
```json
{
  "status": "SIGNED"
}
```
*Note: If this is the final signature, a `CASE_CLOSED` event is emitted.*

---

## Utility: Helper Tools

### 14. Get Scene Map (For Sketch Canvas)
**Endpoint**: `POST /util/scene-map`
**Description**: Returns a static map image URL for a given location to be used as a background for the sketching tool.
**Request Body**:
```json
{
  "lat": 3.140853,
  "lng": 101.693207
}
```
**Response Body**:
```json
{
  "url": "https://maps.googleapis.com/maps/api/staticmap?..."
}
```

### 15. Verify Image (AI Validation)
**Endpoint**: `POST /util/verify-image`
**Description**: Uses Gemini 1.5 Flash to validate if an uploaded image matches its description.
**Request Body**:
```json
{
  "image_base64": "base64-encoded-string...",
  "description": "Car Front"
}
```
**Response Body**:
```json
{
  "valid": true,
  "reason": "The image clearly shows the front of a silver sedan matching the description."
}
```

### 16. Download Report PDF
**Endpoint**: `GET /police/reports/{session_id}/download/{report_type}`
**Description**: Downloads the generated PDF file.
**Path Parameters**:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `string` | Yes | UUID of the session |
| `report_type` | `string` | Yes | One of: `polis_repot`, `rajah_kasar`, `keputusan` |

**Response**:
Binary Stream (application/pdf)
