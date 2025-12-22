import requests
import os

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "mock_key")

class MapService:
    @staticmethod
    def generate_scene_sketch(lat: float, lng: float) -> str:
        # Returns a Static Map URL or Base64
        if GOOGLE_MAPS_API_KEY == "mock_key":
            # Return a placeholder for demo
            return "https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=400x400&key=YOUR_API_KEY"
            
        base_url = "https://maps.googleapis.com/maps/api/staticmap"
        params = {
            "center": f"{lat},{lng}",
            "zoom": 18,
            "size": "600x400",
            "maptype": "satellite",
            "markers": f"color:red|{lat},{lng}",
            "key": GOOGLE_MAPS_API_KEY
        }
        # In a real app, we might download this and convert to base64, or just return the URL
        # For this demo, returning the URL is cleaner for the frontend.
        req = requests.Request('GET', base_url, params=params).prepare()
        return req.url
