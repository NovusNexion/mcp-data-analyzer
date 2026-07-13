import requests
from .base import BaseModel
from ..config import Config

class DeepSeekModel(BaseModel):
    def __init__(self):
        self.api_key = Config.DEEPSEEK_API_KEY
        self.url = "https://api.deepseek.com/v1/chat/completions"

    def chat(self, prompt: str) -> str:
        if not self.api_key:
            raise ValueError("DEEPSEEK_API_KEY not set")
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        messages = [
            {"role": "system", "content": "你是一个只输出SQL语句的专家，绝不附加任何解释。"},
            {"role": "user", "content": prompt}
        ]

        payload = {
            "model": "deepseek-chat",
            "messages": messages,
            "temperature": 0.2
        }
        resp = requests.post(self.url, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]