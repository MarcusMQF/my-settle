<p align="center">
  <img src="app/assets/images/mysettle_icon.png" alt="MySettle Logo" width="300"/>
</p>

<p align="center">
  <strong>Digital Accident Resolution Platform</strong><br/>
  Report minor road accidents without visiting a police station — verified through <strong>MyDigital ID</strong>.
</p>

## The Problem

Current accident reporting in Malaysia is inefficient and stressful:

- **Traffic Congestion**: Minor accidents block roads for hours because drivers are afraid to move, and discussions take time.
- **Trust Issue**: Drivers currently rely on checking physical ICs because there is no guarantee the person is who they claim to be.
- **Wasted Time**: Citizens must visit the police station, often resulting in an average wait of 3 hours.
- **Outdated e-Reporting**: Existing e-Reporting systems only support single-vehicle accidents and still require manual data entry and sketching.

## The Solution

MySettle is an end-to-end platform that allows citizens to lodge reports and allows Police IOs (Investigating Officers) to investigate remotely.

- **The Digital Handshake**: Driver A scans Driver B's QR code to instantly verify identity and license details on both devices.

- **Trusted Evidence**: Drivers take pictures and videos of the scene using MySettle. The app provides clear guidance on how to take evidence, removing the need for an investigator at the scene.

- **Smart Data Collection**: The app auto-generates the "Rajah Kasar" (rough sketch) using Google Maps API, and auto-fills location (GPS) and weather data.

- **3-way Virtual Meeting**: In the case of a dispute, the police can arrange a conference meeting between the Police, Driver A, and Driver B.

## Impact

*Saving Time, Saving Lives, No Panic*

### Citizen

| Benefit | Description |
|---------|-------------|
| **Convenience** | No need to panic when accident happens, just pull out mySettle. |
| **Time Saving** | No need go and wait at police station for the report. |
| **Safety** | Get off the road faster, keep safe and avoid traffic jam. |

### Police IOs

| Benefit | Description |
|---------|-------------|
| **Efficiency** | Digital data entry eliminates 30 minutes of typing per case. |

### Nation

| Benefit | Description |
|---------|-------------|
| **Data** | Accurate, geo-tagged accident data helps MIROS fix dangerous roads ("Blackspots"). |

## Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI
- Expo Go app (for mobile testing)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start --clear
```
Stage 0: Authentication
Login: POST /auth/login - Authenticate or create a mock user profile.
Stage 1: Session Initialization & Handshake
Create Session (Driver A): POST /session/create - Start a new session, get OTP/QR.
Join Session (Driver B): POST /session/join - Join using OTP.
Reconnect: POST /session/reconnect - Rejoin an active session to restore state.
Event Stream: GET /session/stream/{session_id} - SSE stream for real-time updates (handshake, submission events, etc.).
Stage 2: Data Collection & Submission
Submit Report Draft: POST /report/submit - Submit accident details and evidence (photos, videos, sketches).
Stage 3: Police Review (Web Dashboard)
Police Dashboard: GET /police/dashboard - List all sessions requiring attention.
Get Session Details: GET /police/reports/{session_id}/details - Comprehensive accident details for the police view.
Get Report Meta: GET /session/report/{session_id}/meta - Check status of signatures and generated PDFs.
Stage 4: Virtual Meeting
Start Meeting: POST /police/meeting - Generate a Google Meet link and notify drivers.
Stage 5: Report Generation & Police Signature
Generate/Update Report: POST /police/reports/generate - Update decision fields and regenerate PDF artifacts.
Police Sign Report: POST /police/sign - Submit police officer's signature.
Stage 6: Case Closure
Driver Sign Report: POST /session/sign - Driver signs the finalized report to close the case.
Utility / Helper Tools
Get Scene Map: POST /util/scene-map - Get a static map image for sketching.
Verify Image: POST /util/verify-image - AI validation of uploaded evidence.
Download PDF: GET /police/reports/{session_id}/download/{report_type} - Download generated reports (polis_repot, rajah_kasar, keputusan).