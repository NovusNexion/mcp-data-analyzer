import json
from typing import Any, Dict
from .analyzers.data_analyzer import DataAnalyzer
from .utils.response_builder import build_success_response, build_error_response

async def handle_mcp_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    处理 JSON-RPC 2.0 请求
    """
    jsonrpc = request.get("jsonrpc")
    method = request.get("method")
    params = request.get("params", {})
    req_id = request.get("id")

    if jsonrpc != "2.0":
        return build_error_response(req_id, -32600, "Invalid Request")

    try:
        if method == "tools/list":
            result = {
                "tools": [
                    {
                        "name": "analyze_data",
                        "description": "对数据库或Excel文件进行自然语言查询和分析",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "question": {"type": "string", "description": "用户自然语言问题"},
                                "datasource": {"type": "string", "enum": ["mysql", "postgres", "excel"], "description": "数据源类型"},
                                "file_path": {"type": "string", "description": "当datasource为excel时，提供文件路径"}
                            },
                            "required": ["question", "datasource"]
                        }
                    }
                ]
            }
            return build_success_response(req_id, result)

        elif method == "tools/call":
            tool_name = params.get("name")
            arguments = params.get("arguments", {})
            if tool_name == "analyze_data":
                analyzer = DataAnalyzer()
                result = await analyzer.analyze(
                    question=arguments.get("question"),
                    datasource=arguments.get("datasource"),
                    file_path=arguments.get("file_path")
                )
                return build_success_response(req_id, result)
            else:
                return build_error_response(req_id, -32601, f"Tool '{tool_name}' not found")
        else:
            return build_error_response(req_id, -32601, f"Method '{method}' not found")
    except Exception as e:
        return build_error_response(req_id, -32000, str(e))