const API_BASE = '/mcp'; // 通过 vite proxy 转发
const FILE_SERVER_URL = 'http://localhost:8001'; // 文件服务器地址

export async function listTools() {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    })
  });
  return res.json();
}

// 上传文件到文件服务器
export async function uploadFiles(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  const res = await fetch(`${FILE_SERVER_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('文件上传失败');
  return res.json(); // 返回 { file_urls: [...] }
}

// filePath 应为文件服务器返回的 URL 字符串
export async function callAnalyze(question, datasource, filePath = null) {
  const payload = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: 'analyze_data',
      arguments: {
        question,
        datasource,
        ...(filePath && { file_path: filePath })
      }
    }
  };
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json();
}