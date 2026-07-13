import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ResultTable from './ResultTable';

const AnalysisPanel = ({ analysis, data, sql, rowCount, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-500">分析中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 分析文本 */}
      {analysis && (
        <div className="prose prose-sm max-w-none text-gray-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {analysis}
          </ReactMarkdown>
        </div>
      )}

      {/* 数据表格 */}
      {data && data.length > 0 && (
        <div>
          <ResultTable data={data} />
          {rowCount > 10 && (
            <p className="text-xs text-gray-400 mt-1">共 {rowCount} 行，仅显示前10行</p>
          )}
        </div>
      )}

      {/* SQL 查看折叠 */}
      {sql && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
            查看 SQL
          </summary>
          <pre className="bg-gray-50 p-3 rounded-lg border border-gray-200 overflow-x-auto mt-1 text-xs">
            <code>{sql}</code>
          </pre>
        </details>
      )}

      {/* 空状态 */}
      {!analysis && !data && !sql && (
        <p className="text-gray-400 text-center py-4">暂无分析结果</p>
      )}
    </div>
  );
};

export default AnalysisPanel;