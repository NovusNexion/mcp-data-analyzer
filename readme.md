📊 MCP Data Analyzer

    让数据对话像聊天一样简单 —— 基于 MCP 协议的多数据源智能分析平台

https://img.shields.io/badge/Python-3.10+-blue.svg
https://img.shields.io/badge/FastAPI-0.115-green.svg
https://img.shields.io/badge/React-18-blue.svg
https://img.shields.io/badge/MCP-JSON--RPC-purple.svg

---

✨ 核心亮点

    🗣️ 自然语言查询 —— 像和 ChatGPT 聊天一样，用中文提问，自动生成 SQL 并返回分析结果

    📁 多数据源支持 —— 无缝切换 MySQL、PostgreSQL，或直接上传 Excel 文件进行探索式分析

    🤖 AI 驱动分析 —— 集成 DeepSeek / Qwen 大模型，自动解读数据并生成洞察报告

    🔌 标准 MCP 协议 —— 基于 JSON-RPC 2.0，可与任何 MCP 兼容的 AI 客户端（如 Claude Desktop、Cursor）直接对接

    🎨 DeepSeek 风格界面 —— 深色主题、对话历史、置顶/重命名/分享/删除，体验如 AI 原生应用

    📤 Excel 多文件上传 —— 支持拖拽上传、批量选择，文件自动存储至独立文件服务器，解耦可靠

🏗️ 架构概览
```bash

┌─────────────────────────────────────────────────────────────┐
│                        前端 (React)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   DeepSeek 风格对话界面  │  查询表单  │ 数据表格   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MCP 后端 (FastAPI)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  JSON-RPC 2.0  │  MCP 工具  │  数据源连接器        │   │
│  │  /mcp          │  analyzer  │  MySQL/PostgreSQL     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐   ┌─────────────────────────────┐
│   文件服务器 (FastAPI)   │   │    大模型 API               │
│  /upload  │  /files/*  │   │  DeepSeek / Qwen            │
└─────────────────────────┘   └─────────────────────────────┘
```
---

🚀 快速开始
环境要求

    Python 3.10+

    Node.js 18+

    MySQL / PostgreSQL（可选）

1. 克隆项目
```bash
    git clone https://github.com/your-username/mcp-data-analyzer.git
    cd mcp-data-analyzer
```
2. 启动后端
```bash
    cd backend
    pip install -r requirements.txt
    cp .env.example .env  # 填写数据库连接和 API Key
    uvicorn app.main:app --reload --port 8007
```
## 测试
打开Fast API的 http://localhost:8007/docs查看

3. 启动文件服务器
```bash
    cd file_server
    pip install -r requirements.txt
    python main.py  # 默认端口 8001
```
4. 启动前端

基于 **Vite** + React 构建，提供极速开发体验。
1. Vite — 新一代前端构建工具，基于原生 ES 模块（ESM），通过预构建依赖和高效的热模块替换（HMR），实现秒级冷启动和即时更新。
2. 界面采用 Tailwind CSS和Lucide图标，简洁美观，响应式布局，这里不使用Ant Design以保持轻量。
```bash
    cd frontend
    npm install
    cp .env.example .env  # 填写 VITE_FILE_SERVER_URL
    npm run dev
```

访问 http://localhost:3000 开始使用！

🧩 主要功能

    功能	说明
    自然语言查询	输入“查询最近一周订单量前5的城市”，自动生成 SQL 并返回结果
    多数据源切换	在 MySQL / PostgreSQL / Excel 间一键切换，底部标签同步
    Excel 文件上传	多文件上传至文件服务器，支持 .xlsx / .xls，自动合并分析
    对话管理	历史对话置顶、重命名、分享（复制内容）、删除，自动生成标题
    数据可视化	查询结果以表格呈现，支持滚动查看，表头固定
    智能分析	大模型自动解读数据，提供洞察和建议
---
🎯 使用场景

    📈 数据分析师 —— 快速探索数据，用自然语言替代 SQL 编写

    🧑‍💼 产品/运营 —— 自助查询业务数据，无需依赖技术团队

    🔬 AI 开发者 —— 作为 MCP 服务接入 Claude Desktop / Cursor，让 AI 直接操作你的数据库

    📚 教育培训 —— 用于演示 SQL 生成、数据可视化、AI 辅助分析

🛠️ 技术栈

    层级	技术
    前端	React 18 + Vite + Tailwind CSS + Lucide Icons
    后端	FastAPI + SQLAlchemy + Pandas + MCP (JSON-RPC)
    大模型	DeepSeek API / Qwen API
    文件服务	FastAPI + multipart/form-data
    数据库	MySQL / PostgreSQL / Excel (pandas)

