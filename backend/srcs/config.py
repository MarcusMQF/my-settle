import os
from dotenv import load_dotenv

load_dotenv()

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
GEMINI_API_LIST=os.getenv("GEMINI_API_LIST", "").split(',')
GEMINI_MODEL_NAME=os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")


