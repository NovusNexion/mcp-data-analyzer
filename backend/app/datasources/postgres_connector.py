import psycopg2
import pandas as pd
from .base import DataSourceConnector
from ..config import Config

class PostgresConnector(DataSourceConnector):
    def __init__(self):
        self.connection = None

    def connect(self):
        self.connection = psycopg2.connect(
            host=Config.POSTGRES_HOST,
            port=Config.POSTGRES_PORT,
            user=Config.POSTGRES_USER,
            password=Config.POSTGRES_PASSWORD,
            database=Config.POSTGRES_DATABASE
        )

    def execute_query(self, sql: str) -> pd.DataFrame:
        if not self.connection:
            self.connect()
        return pd.read_sql(sql, self.connection)

    def get_schema(self) -> str:
        if not self.connection:
            self.connect()
        cursor = self.connection.cursor()
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public'
        """)
        tables = cursor.fetchall()
        schema_lines = []
        for (table_name,) in tables:
            cursor.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name='{table_name}'
            """)
            cols = cursor.fetchall()
            cols_desc = ", ".join([f"{col[0]} ({col[1]})" for col in cols])
            schema_lines.append(f"Table: {table_name}\nColumns: {cols_desc}")
        return "\n\n".join(schema_lines)

    def close(self):
        if self.connection:
            self.connection.close()