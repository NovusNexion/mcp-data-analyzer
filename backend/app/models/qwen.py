import requests
from .base import BaseModel
from ..config import Config

class QwenModel(BaseModel):
    def __init__(self):
        self.api_key = Config.QWEN_API_KEY
        self.url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"

    def chat(self, prompt: str) -> str:
        if not self.api_key:
            raise ValueError("QWEN_API_KEY not set")
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "qwen-turbo",
            "input": {
                "messages": [{"role": "user", "content": prompt}]
            },
            "parameters": {"temperature": 0.2}
        }
        resp = requests.post(self.url, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data["output"]["choices"][0]["message"]["content"]