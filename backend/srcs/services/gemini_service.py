import os
import random

# In a real scenario, import google.generativeai
# import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "mock_key")

class GeminiService:
    @staticmethod
    def validate_image(image_base64: str, description: str):
        """
        Mock implementation of Gemini Vision API.
        Real implementation would send the base64 to standard Gemini Vision endpoint.
        """
        if GEMINI_API_KEY == "mock_key":
            # Mock Logic: If description contains "fail", return False.
            if "fail" in description.lower():
                return {"valid": False, "reason": "Image does not match description"}
            
            return {
                "valid": True,
                "car_plate": f"W{random.randint(1000,9999)}X",
                "confidence": 0.98
            }
        
        # Real Implementation skeleton
        # model = genai.GenerativeModel('gemini-pro-vision')
        # response = model.generate_content([description, image_base64])
        # return parse(response)
        return {"valid": True, "car_plate": "MOCK123"}
