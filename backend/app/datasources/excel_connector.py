import pandas as pd
from .base import DataSourceConnector

class ExcelConnector(DataSourceConnector):
    def __init__(self, file_path: str):
        """
        file_path: 可以是本地路径或 HTTP URL，多个路径用逗号分隔。
        """
        self.file_path = file_path
        self.df = None

    def connect(self):
        """
        读取 Excel 文件（支持单个或多个文件），合并为一个 DataFrame。
        """
        paths = [p.strip() for p in self.file_path.split(',') if p.strip()]
        if not paths:
            raise ValueError("未提供有效的文件路径")

        dfs = []
        for path in paths:
            # pd.read_excel 支持 HTTP/HTTPS URL 和本地路径
            df = pd.read_excel(path, sheet_name=0)
            dfs.append(df)

        if len(dfs) == 1:
            self.df = dfs[0]
        else:
            self.df = pd.concat(dfs, ignore_index=True)

    def execute_query(self, sql: str) -> pd.DataFrame:
        """
        Excel 不支持 SQL，此处仅作兼容：
        若 SQL 包含 "SELECT" 则返回全部数据，否则抛出异常。
        """
        if self.df is None:
            self.connect()
        if "SELECT" in sql.upper():
            return self.df
        else:
            raise NotImplementedError("Excel 数据源目前仅支持全量查询，请使用简单 SELECT *")

    def get_schema(self) -> str:
        if self.df is None:
            self.connect()
        col_info = ", ".join([f"{col} ({dtype})" for col, dtype in self.df.dtypes.items()])
        return f"Excel Sheet(s): {self.file_path}\nColumns: {col_info}"

    def close(self):
        self.df = None