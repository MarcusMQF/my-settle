import qrcode
import io
import base64
import random
import string
import secrets

class QRService:
    @staticmethod
    def generate_otp() -> str:
        return secrets.token_urlsafe(12)

    @staticmethod
    def generate_qr_base64(data: str) -> str:
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return img_str
