import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ResultTable from './ResultTable';

const MessageList = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={msg.role === 'user' 
            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]' 
            : 'bg-gray-700 text-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]'
          }>
            {msg.role === 'user' ? (
              <div className="text-sm">{msg.content}</div>
            ) : (
              <div className="space-y-3 text-gray-100">
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none prose-invert">
                  {msg.content}
                </ReactMarkdown>

                {msg.data && msg.data.length > 0 && (
                  <div className="mt-3">
                    <ResultTable data={msg.data} />
                    {msg.rowCount > 10 && (
                      <p className="text-xs text-gray-400 mt-1">共 {msg.rowCount} 行，仅显示前10行</p>
                    )}
                  </div>
                )}

                {msg.sql && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-300">查看 SQL</summary>
                    <pre className="bg-gray-800 p-2 rounded border border-gray-600 overflow-x-auto mt-1">
                      <code className="text-gray-300">{msg.sql}</code>
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;