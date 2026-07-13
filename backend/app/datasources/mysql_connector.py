import pymysql
import pandas as pd
from .base import DataSourceConnector
from ..config import Config

class MySQLConnector(DataSourceConnector):
    def __init__(self):
        self.connection = None

    def connect(self):
        self.connection = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE
        )

    def execute_query(self, sql: str) -> pd.DataFrame:
        if not self.connection:
            self.connect()
        return pd.read_sql(sql, self.connection)

    def get_schema(self) -> str:
        if not self.connection:
            self.connect()
        cursor = self.connection.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        schema_lines = []
        for (table_name,) in tables:
            cursor.execute(f"DESCRIBE {table_name}")
            columns = cursor.fetchall()
            cols_desc = ", ".join([f"{col[0]} ({col[1]})" for col in columns])
            schema_lines.append(f"Table: {table_name}\nColumns: {cols_desc}")
        return "\n\n".join(schema_lines)

    def close(self):
        if self.connection:
            self.connection.close()