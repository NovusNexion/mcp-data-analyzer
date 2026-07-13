# file_server/main.py
import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import uvicorn

app = FastAPI(title="File Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 配置服务地址（需根据实际部署修改，这里使用环境变量或默认）
FILE_SERVER_HOST = os.getenv("FILE_SERVER_HOST", "http://localhost:8001")

@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    """
    上传文件，返回可访问的下载URL列表
    """
    saved_urls = []
    for file in files:
        # 生成唯一文件名
        ext = os.path.splitext(file.filename)[1] or ".xlsx"
        unique_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)
        # 保存文件
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        # 构造可访问的URL
        file_url = f"{FILE_SERVER_HOST}/files/{unique_name}"
        saved_urls.append(file_url)
    return {"file_urls": saved_urls}

@app.get("/files/{file_id}")
async def get_file(file_id: str):
    """
    下载文件
    """
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=file_id)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)