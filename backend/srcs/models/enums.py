from enum import Enum

class SessionStatus(str, Enum):
    CREATED = "CREATED"                 # Waiting for handshake (user join)
    HANDSHAKE = "HANDSHAKE"             # Waiting for both to submit draft
    PENDING_POLICE = "PENDING_POLICE"   # Waiting for police to review (submitted)
    MEETING_STARTED = "MEETING_STARTED" # Police officer started the meeting/review
    POLICE_SIGNED = "POLICE_SIGNED"     # Police officer signed the report (returned)
    COMPLETED = "COMPLETED"             # All parties signed (case closed)

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
