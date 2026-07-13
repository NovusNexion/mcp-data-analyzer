import React, { useState } from 'react';
import { Send, Database, Upload } from 'lucide-react';
import { uploadFiles } from '../api';

const QueryForm = ({ onSubmit, disabled }) => {
  const [question, setQuestion] = useState('');
  const [datasource, setDatasource] = useState('mysql');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    let filePath = null;
    if (datasource === 'excel' && selectedFiles.length > 0) {
      try {
        const result = await uploadFiles(selectedFiles);
        filePath = result.file_urls.join(', ');
      } catch (error) {
        alert('文件上传失败：' + error.message);
        return;
      }
    }

    onSubmit(question, datasource, filePath || null);
    setQuestion('');
    setSelectedFiles([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files); // 替换原有文件
  };

  // 删除单个文件
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const dataSources = [
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'excel', label: 'Excel' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* 第一行：数据源下拉 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-700 rounded-lg border border-gray-600 px-2 py-1">
          <Database className="w-4 h-4 text-gray-400" />
          <select
            value={datasource}
            onChange={(e) => setDatasource(e.target.value)}
            className="border-0 outline-none bg-transparent text-sm text-gray-200"
            disabled={disabled}
          >
            {dataSources.map(ds => (
              <option key={ds.value} value={ds.value}>{ds.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 文件列表区域：仅当 Excel 且选中文件时显示 */}
      {datasource === 'excel' && selectedFiles.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-lg border border-gray-600">
          {selectedFiles.map((file, index) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs text-gray-300 bg-gray-600 px-2 py-0.5 rounded"
            >
              {file.name}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-white ml-1"
                title="移除文件"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 输入框 */}
      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入你的数据问题，例如：查询最近一周的订单量"
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pb-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-200 placeholder-gray-400 resize-none overflow-y-auto"
          disabled={disabled}
          style={{ minHeight: '80px', maxHeight: '150px' }}
        />

        {/* 数据源标签（左下） */}
        <div className="absolute left-3 bottom-3 flex items-center gap-2">
          {dataSources.map(ds => (
            <button
              key={ds.value}
              type="button"
              onClick={() => {
                setDatasource(ds.value);
                if (ds.value !== 'excel') setSelectedFiles([]);
              }}
              className={`text-xs px-2 py-0.5 rounded transition ${
                datasource === ds.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
              disabled={disabled}
            >
              {ds.label}
            </button>
          ))}
        </div>

        {/* 右下角：上传图标 + 发送按钮 */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {datasource === 'excel' && (
            <label
              className="cursor-pointer text-gray-400 hover:text-white transition p-1"
              title="上传 Excel 文件（支持多选）"
            >
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept=".xlsx,.xls"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
            </label>
          )}
          <button
            type="submit"
            disabled={disabled || !question.trim()}
            className="text-gray-400 hover:text-white disabled:opacity-50 transition p-1"
            title="发送查询"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default QueryForm;