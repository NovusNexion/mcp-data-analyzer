from abc import ABC, abstractmethod

class BaseModel(ABC):
    @abstractmethod
    def chat(self, prompt: str) -> str:
        """发送 prompt 给大模型，返回响应文本"""
        pass