from fastapi import APIRouter
from pydantic import BaseModel
from srcs.services.map_service import MapService
from srcs.services.gemini_service import GeminiService

router = APIRouter(prefix="/util", tags=["Utility"])

class MapRequest(BaseModel):
    lat: float
    lng: float

class VerifyRequest(BaseModel):
    image_base64: str
    description: str

@router.post("/scene-map")
def get_scene_map(req: MapRequest):
    return {"url": MapService.generate_scene_sketch(req.lat, req.lng)}

@router.post("/verify-image")
def verify_image(req: VerifyRequest):
    return GeminiService.validate_image(req.image_base64, req.description)
