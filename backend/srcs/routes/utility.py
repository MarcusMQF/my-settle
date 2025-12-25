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
async def get_scene_map(req: MapRequest):
    return {"image": await MapService.generate_scene_sketch(req.lat, req.lng)}

@router.post("/verify-image")
async def verify_image(req: VerifyRequest):
    return await GeminiService.validate_image(req.image_base64, req.description)
