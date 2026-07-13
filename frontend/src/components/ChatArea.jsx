import React, { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import QueryForm from './QueryForm';
import { Loader2 } from 'lucide-react';

const ChatArea = ({ conversation, onSendMessage, isSidebarOpen }) => {
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSubmit = async (question, datasource, filePath) => {
    const userMsg = { role: 'user', content: question, timestamp: Date.now() };
    onSendMessage(userMsg);

    setLoading(true);
    try {
      const { callAnalyze } = await import('../api');
      const response = await callAnalyze(question, datasource, filePath);
      
      if (response.error) {
        throw new Error(response.error.message || '未知错误');
      }
      const result = response.result;
      const assistantMsg = {
        role: 'assistant',
        content: result.analysis || '分析完成',
        data: result.data || [],
        sql: result.sql || '',
        rowCount: result.row_count || 0,
        timestamp: Date.now()
      };
      onSendMessage(assistantMsg);
    } catch (error) {
      const errorMsg = {
        role: 'assistant',
        content: `❌ 出错：${error.message}`,
        isError: true,
        timestamp: Date.now()
      };
      onSendMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-800">
      <header className="border-b border-gray-700 px-6 py-4 bg-gray-800 sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-100">
          {conversation?.title || '新对话'}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <MessageList messages={conversation?.messages || []} />
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-2xl rounded-tl-none px-4 py-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
              <span className="text-sm text-gray-300">正在分析...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-700 p-4 bg-gray-800/90">
        <QueryForm onSubmit={handleSubmit} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatArea;