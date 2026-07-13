import os
import re
import pandas as pd
from ..config import Config
from ..datasources import MySQLConnector, PostgresConnector, ExcelConnector
from ..models import DeepSeekModel, QwenModel
from ..utils.schema_extractor import extract_schema_from_df  # 实际用不到，仅示意

class DataAnalyzer:
    def __init__(self, model_name: str = None):
        model_name = model_name or Config.DEFAULT_MODEL
        if model_name == "deepseek":
            self.model = DeepSeekModel()
        elif model_name == "qwen":
            self.model = QwenModel()
        else:
            raise ValueError(f"Unsupported model: {model_name}")

    async def analyze(self, question: str, datasource: str, file_path: str = None):
        # 1. 获取数据源连接器
        if datasource == "mysql":
            connector = MySQLConnector()
        elif datasource == "postgres":
            connector = PostgresConnector()
        elif datasource == "excel":
            if not file_path:
                raise ValueError("Excel 数据源需要提供 file_path")
            #if not os.path.exists(file_path):
            #    raise FileNotFoundError(f"Excel 文件不存在: {file_path}")
            connector = ExcelConnector(file_path)
        else:
            raise ValueError(f"不支持的数据源: {datasource}")

        try:
            connector.connect()
            schema = connector.get_schema()
            print(schema)

            # 2. 调用大模型生成 SQL
            sql_prompt = f"""
                你是一个 SQL 专家。请根据下面的数据库结构，将用户的问题转换为一个可执行的 SQL 查询。

                - 只返回纯 SQL 语句，不要任何额外文字。
                - 如果问题涉及“最晚”、“最早”、“前N个”等，请使用 ORDER BY 和 LIMIT。

                数据库结构:
                {schema}

                用户问题: {question}
                SQL:
                """
            sql = self.model.chat(sql_prompt).strip()
            print(sql_prompt)
            print(sql)
            # 提取 SQL（如果模型返回了带解释的文本，尝试提取）
            sql_match = re.search(r'(?i)(SELECT|SHOW|DESCRIBE|PRAGMA).*?;', sql, re.DOTALL)
            if sql_match:
                sql = sql_match.group(0)
            else:
                # 若没有分号，直接使用整段
                pass

            # 3. 执行查询
            df = connector.execute_query(sql)
            if df.empty:
                result_data = {"rows": [], "columns": []}
                data_preview = "（查询结果为空）"
            else:
                # 转换为字典列表
                result_data = df.to_dict(orient="records")
                data_preview = df.head(10).to_string(index=False)

            # 4. 调用大模型进行结果分析
            analysis_prompt = f"""
用户问题: {question}
执行的 SQL: {sql}
查询结果（前10行）:
{data_preview}

请用中文为用户提供一段简洁、有洞察力的数据解读，包含关键发现和建议（如适用）。
分析:
"""
            analysis = self.model.chat(analysis_prompt)

            return {
                "question": question,
                "datasource": datasource,
                "sql": sql,
                "data": result_data,
                "analysis": analysis,
                "row_count": len(df)
            }
        finally:
            connector.close()