from abc import ABC, abstractmethod
import pandas as pd

class DataSourceConnector(ABC):
    @abstractmethod
    def connect(self):
        """建立连接"""
        pass

    @abstractmethod
    def execute_query(self, sql: str) -> pd.DataFrame:
        """执行查询并返回 DataFrame"""
        pass

    @abstractmethod
    def get_schema(self) -> str:
        """返回数据库/文件的 schema 描述（供 LLM 生成 SQL）"""
        pass

    @abstractmethod
    def close(self):
        """关闭连接"""
        pass