from enum import Enum

class SessionStatus(str, Enum):
    CREATED = "created"                 # Waiting for handshake (user join)
    HANDSHAKE = "handshake"             # Waiting for both to submit draft
    PENDING_POLICE = "pending_police"   # Waiting for police to review (submitted)
    MEETING_STARTED = "meeting_started" # Police officer started the meeting/review
    POLICE_SIGNED = "police_signed"     # Police officer signed the report (returned)
    COMPLETED = "completed"             # All parties signed (case closed)

class EvidenceTag(str, Enum):
    CAR_FRONT = "Car Front"
    CAR_BACK = "Car Back"
    CAR_LEFT = "Car Left"
    CAR_RIGHT = "Car Right"
    DAMAGE_PART = "Damage Part"
    RAJAH_KASAR = "Rough Sketch"
    DASHCAM = "Dashcam"
    DOCUMENT = "Document"
    OTHER = "Other"
