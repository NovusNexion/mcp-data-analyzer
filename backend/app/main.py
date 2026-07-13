from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .mcp_server import handle_mcp_request

app = FastAPI(title="MCP Data Analyzer")

# 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/mcp")
async def mcp_endpoint(request: Request):
    """MCP 统一入口，接收 JSON-RPC 2.0 请求"""
    body = await request.json()
    return await handle_mcp_request(body)

@app.get("/health")
async def health_check():
    return {"status": "ok"}