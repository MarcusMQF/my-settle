<p align="center">
  <img src="assets/images/mysettle_icon.png" alt="MySettle Logo" width="300"/>
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
