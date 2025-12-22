import requests
from requests import Response

class TestClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')

    def check_status(self, res: Response, expected_status: int = 200):
        if res.status_code != expected_status:
            # We print the error before exiting to make it visible why it failed
            print(f"FAILED: {res.status_code} != {expected_status}\n{res.text}")
            exit(1)

    def request(self, method: str, path: str, **kwargs) -> dict:
        url = f"{self.base_url}{path}"
        
        try:
            res = requests.request(method, url, **kwargs)
            
            # Extract data if available
            data = {}
            if res.content:
                try:
                    data = res.json()
                except ValueError:
                    # Not JSON
                    pass
            
            self.check_status(res)
            return data
        except requests.exceptions.ConnectionError:
            exit(1)

    def post(self, path: str, **kwargs) -> dict:
        return self.request("POST", path, **kwargs)

    def get(self, path: str, **kwargs) -> dict:
        return self.request("GET", path, **kwargs)
        
    def connect_sse(self, path: str):
        url = f"{self.base_url}{path}"
        
        try:
            res = requests.get(url, stream=True, timeout=60)
            if res.status_code != 200:
                return None
            return res
        except Exception:
            return None
