import os
import random

from google import genai

from srcs.config import GEMINI_API_LIST

class GeminiService:
    _keys = GEMINI_API_LIST
    _current_index = -1

    @classmethod
    def _get_next_key(cls):
        # Initialize random start if first time
        if cls._current_index == -1:
            if not cls._keys or (len(cls._keys) == 1 and not cls._keys[0]):
                return "mock_key"
            cls._current_index = random.randint(0, len(cls._keys) - 1)
        else:
            # Rotate
            cls._current_index = (cls._current_index + 1) % len(cls._keys)
        
        return cls._keys[cls._current_index] if cls._keys else "mock_key"

    @staticmethod
    async def validate_image(image_base64: str, description: str):
        """
        Mock implementation of Gemini Vision API.
        Real implementation would send the base64 to standard Gemini Vision endpoint.
        """
        # placeholder for real implementation
        return {
            "valid": True,
            "car_plate": f"W{random.randint(1000,9999)}X",
            "confidence": 0.98
        }

        api_key = GeminiService._get_next_key()
        
        if api_key == "mock_key":
            # Mock Logic: If description contains "fail", return False.
            if "fail" in description.lower():
                return {"valid": False, "reason": "Image does not match description"}
            
            return {
                "valid": True,
                "car_plate": f"W{random.randint(1000,9999)}X",
                "confidence": 0.98
            }
        
        # Real Implementation skeleton
        # genai.configure(api_key=api_key)
        # model = genai.GenerativeModel('gemini-pro-vision')
        # response = await model.generate_content_async([description, image_base64])
        # return parse(response)
        return {"valid": True, "car_plate": "REAL_API_CALLED"}

    @staticmethod
    async def draw_image(image_base64: str, description: str) -> str:
        """
        Generates/Edits an image based on input image and description.
        Returns base64 string of the result.
        Internal use only.
        """
        api_key = GeminiService._get_next_key()

        if api_key == "mock_key":
            # Mock: Return the same image or a placeholder
            return image_base64

        # Real Implementation skeleton (Conceptual)
        # genai.configure(api_key=api_key)
        # model = genai.GenerativeModel('gemini-pro-vision') # or appropriate model
        # response = await model.generate_content_async([description, image_base64]) # and logic to get image
        # return response.images[0] if response.images else ""
        return image_base64
