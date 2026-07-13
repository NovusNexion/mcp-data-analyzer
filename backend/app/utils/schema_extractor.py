# 该工具类用于从 DataFrame 或数据库提取 schema，实际已被各个 Connector 自身实现，此处保留备用
import pandas as pd

def extract_schema_from_df(df: pd.DataFrame) -> str:
    """从 DataFrame 提取列信息"""
    col_info = ", ".join([f"{col} ({dtype})" for col, dtype in df.dtypes.items()])
    return f"DataFrame Columns: {col_info}"